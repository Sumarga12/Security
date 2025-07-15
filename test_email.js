const { sendPasswordResetEmail, sendWelcomeEmail } = require('./backend/utils/sendEmail');
require('dotenv').config({ path: './backend/.env' });

async function testEmailFunctionality() {
  console.log('🧪 Testing Email Functionality...\n');
  
  // Test email configuration
  console.log('📧 Email Configuration:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ Set' : '❌ Not set');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ Not set');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('❌ Email configuration incomplete!');
    console.log('Please set up your .env file according to EMAIL_SETUP_GUIDE.md');
    return;
  }

  const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
  const testName = 'Test User';
  const testResetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/test-token-123`;

  try {
    console.log('📤 Testing Welcome Email...');
    await sendWelcomeEmail(testEmail, testName);
    console.log('✅ Welcome email sent successfully!');
    console.log('📬 Check your inbox for the welcome email\n');

    // Wait a bit before sending the next email
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('📤 Testing Password Reset Email...');
    await sendPasswordResetEmail(testEmail, testResetUrl, testName);
    console.log('✅ Password reset email sent successfully!');
    console.log('📬 Check your inbox for the password reset email\n');

    console.log('🎉 All email tests passed!');
    console.log('📋 Next steps:');
    console.log('   1. Check your email inbox (and spam folder)');
    console.log('   2. Verify the emails look professional');
    console.log('   3. Test the forgot password flow in your app');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check EMAIL_SETUP_GUIDE.md for setup instructions');
    console.log('   2. Verify your Gmail App Password is correct');
    console.log('   3. Ensure 2-Factor Authentication is enabled');
    console.log('   4. Check your internet connection');
  }
}

// Run the test
testEmailFunctionality(); 