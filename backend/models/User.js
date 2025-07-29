// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  phone:    { type: String },

  resetPasswordToken:   String,
  resetPasswordExpires: Date,
  profilePhoto: { type: String },
  // MFA fields
  mfaCode: String,
  mfaCodeExpires: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  passwordHistory: { type: [String], default: [] },
  passwordLastChanged: { type: Date },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain ↔ hash
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate reset token & expiry
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken   = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 3600_000; // 1h
  return resetToken;
};

// Encryption helpers
function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(text) {
  if (!text) return text;
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
// Encrypt phone before save
userSchema.pre('save', function (next) {
  if (this.isModified('phone') && this.phone) {
    this.phone = encrypt(this.phone);
  }
  next();
});
// Decrypt phone on read
userSchema.methods.getDecryptedPhone = function () {
  return decrypt(this.phone);
};

module.exports = mongoose.model('User', userSchema);
