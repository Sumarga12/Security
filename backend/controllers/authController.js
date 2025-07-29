// controllers/authController.js
const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');
const User      = require('../models/User');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/sendEmail');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const { logActivity } = require('../utils/activityLogger');
const axios = require('axios');

const generateToken = (id) => {
  console.log('Generating token for user ID:', id);
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Password policy utility
function validatePasswordPolicy(password) {
  const minLength = 8;
  const maxLength = 32;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (
    typeof password !== 'string' ||
    password.length < minLength ||
    password.length > maxLength ||
    !hasUpper || !hasLower || !hasNumber || !hasSpecial
  ) {
    return `Password must be ${minLength}-${maxLength} characters and include uppercase, lowercase, number, and special character.`;
  }
  return null;
}

// Helper to generate a 6-digit code
function generateMfaCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to check password reuse
async function isPasswordReused(user, newPassword) {
  for (const oldHash of user.passwordHistory.slice(-3)) {
    if (await bcrypt.compare(newPassword, oldHash)) return true;
  }
  return false;
}

// @desc Signup
// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });

  const policyError = validatePasswordPolicy(password);
  if (policyError) return res.status(400).json({ error: policyError });

  if (await User.findOne({ email }))
    return res.status(400).json({ error: 'Email already registered.' });

  // Create user
  const user  = await User.create({ name, email, password, passwordLastChanged: new Date() });
  // Add initial password hash to history
  user.passwordHistory = [user.password];
  await user.save();
  const token = generateToken(user._id);

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name);
    console.log('Welcome email sent to:', user.email);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Don't fail the signup if email fails
  }

  logActivity({ userId: user._id, email: user.email, action: 'signup', details: 'User registered' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
  res.status(201).json({
    user:  { id: user._id, name: user.name, email: user.email }
  });
};

// @desc Login
// @route POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password, captchaToken } = req.body;
  if (!captchaToken) {
    return res.status(400).json({ error: 'CAPTCHA is required.' });
  }
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`
    );
    if (!response.data.success) {
      return res.status(400).json({ error: 'CAPTCHA verification failed.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'CAPTCHA verification error.' });
  }
  const user = await User.findOne({ email }).select('+password');

  // Brute-force prevention: check lockout
  if (user && user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(423).json({ error: `Account locked. Try again after ${new Date(user.lockUntil).toLocaleTimeString()}.` });
  }

  // Password expiry: force change if >90 days
  if (user && user.passwordLastChanged && Date.now() - new Date(user.passwordLastChanged).getTime() > 90 * 24 * 60 * 60 * 1000) {
    return res.status(403).json({ error: 'Password expired. Please reset your password.' });
  }

  if (!user || !(await user.matchPassword(password))) {
    // Increment loginAttempts if user exists
    if (user) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      // Lock account if too many attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();
        return res.status(423).json({ error: 'Account locked due to too many failed attempts. Try again in 15 minutes.' });
      }
      await user.save();
    }
    logActivity({ userId: user?._id, email: user?.email, action: 'login_failed', details: 'Invalid credentials' });
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Reset loginAttempts and lockUntil on successful login
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  // MFA: generate code, store, and email it
  const mfaCode = generateMfaCode();
  user.mfaCode = mfaCode;
  user.mfaCodeExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  // Send MFA code via email
  try {
    await sendEmail.sendMfaCodeEmail(user.email, mfaCode, user.name);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send MFA code. Please try again.' });
  }

  logActivity({ userId: user._id, email: user.email, action: 'login', details: 'Login successful, MFA sent' });

  // Do not issue token yet
  res.json({ mfaRequired: true, message: 'MFA code sent to your email.' });
};

// @desc Verify MFA code and complete login
// @route POST /api/auth/verify-mfa
exports.verifyMfa = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.mfaCode || !user.mfaCodeExpires)
    return res.status(400).json({ error: 'MFA not initiated or expired.' });
  if (user.mfaCodeExpires < Date.now())
    return res.status(400).json({ error: 'MFA code expired. Please login again.' });
  if (user.mfaCode !== code)
    return res.status(401).json({ error: 'Invalid MFA code.' });
  // Clear MFA fields
  user.mfaCode = undefined;
  user.mfaCodeExpires = undefined;
  await user.save();
  // Issue token
  const token = generateToken(user._id);
  logActivity({ userId: user._id, email: user.email, action: 'mfa_verified', details: 'MFA code verified, login complete' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
  res.json({
    user:  { id: user._id, name: user.name, email: user.email }
  });
};

// @desc Change password
// @route POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password passwordHistory');

  if (!(await user.matchPassword(currentPassword)))
    return res.status(401).json({ error: 'Current password is incorrect.' });

  const policyError = validatePasswordPolicy(newPassword);
  if (policyError) return res.status(400).json({ error: policyError });

  if (await isPasswordReused(user, newPassword))
    return res.status(400).json({ error: 'You cannot reuse your last 3 passwords.' });

  // Save old hash to history
  user.passwordHistory = [...(user.passwordHistory || []), user.password];
  // Keep only last 3
  if (user.passwordHistory.length > 3) user.passwordHistory = user.passwordHistory.slice(-3);
  user.password = newPassword;
  user.passwordLastChanged = new Date();
  await user.save();
  logActivity({ userId: user._id, email: user.email, action: 'change_password', details: 'Password changed' });
  res.json({ message: 'Password changed successfully.' });
};

// @desc Request password reset
// @route POST /api/auth/request-password-reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.json({ message: 'If that email is registered, you\'ll receive a reset link.' });

  const resetToken = user.getResetPasswordToken();
  await user.save();

  // For HashRouter, we need to use #/reset-password/token format
  const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl, user.name);
    console.log('Password reset email sent to:', user.email);
    console.log('Reset URL:', resetUrl);
    res.json({ message: 'Reset link sent (check your email).' });
  } catch (err) {
    console.error('Password reset email error:', err);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500).json({ error: 'Email could not be sent. Please try again later.' });
  }
};

// @desc Reset password via token
// @route PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken:   hashed,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ error: 'Invalid or expired reset token.' });

  const policyError = validatePasswordPolicy(req.body.password);
  if (policyError) return res.status(400).json({ error: policyError });

  if (await isPasswordReused(user, req.body.password))
    return res.status(400).json({ error: 'You cannot reuse your last 3 passwords.' });

  // Save old hash to history
  user.passwordHistory = [...(user.passwordHistory || []), user.password];
  if (user.passwordHistory.length > 3) user.passwordHistory = user.passwordHistory.slice(-3);
  user.password = req.body.password;
  user.passwordLastChanged = new Date();
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Your password has been updated.' });
};

// @desc Update user profile
// @route PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);

  if (!user)
    return res.status(404).json({ error: 'User not found.' });

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'Email already in use.' });
  }

  user.name = name;
  user.email = email;

  await user.save();
  logActivity({ userId: user._id, email: user.email, action: 'update_profile', details: 'Profile updated' });

  res.json({
    user: { id: user._id, name: user.name, email: user.email },
    message: 'Profile updated successfully.'
  });
};

// @desc Logout
// @route POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
};
