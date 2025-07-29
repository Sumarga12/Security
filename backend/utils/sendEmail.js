// utils/sendEmail.js
const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
    },
  });
};

// Email template for password reset
const createPasswordResetEmail = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset - HomeCleaning</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 HomeCleaning</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>We received a request to reset your password for your HomeCleaning account.</p>
          <p>Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>For security, this link can only be used once</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <p>Best regards,<br>The HomeCleaning Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to you because you requested a password reset for your HomeCleaning account.</p>
          <p>© 2024 HomeCleaning. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email template for welcome email
const createWelcomeEmail = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to HomeCleaning</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 HomeCleaning</h1>
          <p>Welcome to the Family!</p>
        </div>
        <div class="content">
          <h2>Welcome ${userName}! 🎉</h2>
          <p>Thank you for joining HomeCleaning! We're excited to have you as part of our beauty community.</p>
          <p>With HomeCleaning, you can:</p>
          <ul>
            <li>✨ Book professional beauty services</li>
            <li>💅 Discover amazing treatments</li>
            <li>🌟 Read authentic customer reviews</li>
            <li>💳 Enjoy secure payment options</li>
          </ul>
          <p>Ready to start your beauty journey? Browse our services and book your first appointment!</p>
          <p>Best regards,<br>The HomeCleaning Team</p>
        </div>
        <div class="footer">
          <p>© 2024 HomeCleaning. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email template for MFA code
const createMfaCodeEmail = (code, userName) => `
  <div style="font-family: Arial, sans-serif;">
    <h2>Multi-Factor Authentication Code</h2>
    <p>Hi ${userName || ''},</p>
    <p>Your HomeCleaning login verification code is:</p>
    <div style="font-size: 2rem; font-weight: bold; color: #22C55E; margin: 16px 0;">${code}</div>
    <p>This code will expire in 5 minutes. If you did not attempt to login, please ignore this email.</p>
    <p>Thank you,<br/>HomeCleaning Security Team</p>
  </div>
`;

const sendMfaCodeEmail = async (email, code, userName) => {
  const html = createMfaCodeEmail(code, userName);
  await sendEmail({
    to: email,
    subject: 'Your HomeCleaning MFA Verification Code',
    html,
    type: 'mfa-code',
  });
};

const sendEmail = async ({ to, subject, html, type = 'custom' }) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('Email transporter verified successfully');
    
    const mailOptions = {
      from: `"HomeCleaning" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Convenience functions for specific email types
const sendPasswordResetEmail = async (email, resetUrl, userName) => {
  const html = createPasswordResetEmail(resetUrl, userName);
  return await sendEmail({
    to: email,
    subject: '�� Reset Your HomeCleaning Password',
    html,
    type: 'password-reset'
  });
};

const sendWelcomeEmail = async (email, userName) => {
  const html = createWelcomeEmail(userName);
  return await sendEmail({
    to: email,
    subject: '🎉 Welcome to HomeCleaning!',
    html,
    type: 'welcome'
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  createPasswordResetEmail,
  createWelcomeEmail,
  sendMfaCodeEmail,
  createMfaCodeEmail
};
