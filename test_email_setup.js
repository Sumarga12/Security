// test_email_setup.js
require('dotenv').config();
const { sendPasswordResetEmail } = require('./backend/utils/sendEmail');

async function testEmailSetup() {
  console.log('🔧 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ Missing (defaulting to http://localhost:5173)');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('MONGO_URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/homeglam');
  
  console.log('\n📧 Testing Email Sending...');
  
  try {
    const testResetUrl = 'http://localhost:5173/#/reset-password/test-token-123';
    await sendPasswordResetEmail('hglam0052@gmail.com', testResetUrl, 'Test User');
    console.log('✅ Email test successful! Check your console for details.');
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    console.log('\n🔧 To fix email issues:');
    console.log('1. Create a .env file in the backend directory');
    console.log('2. Add your Gmail credentials:');
    console.log('   EMAIL_USER=your-email@gmail.com');
    console.log('   EMAIL_APP_PASSWORD=your-gmail-app-password');
    console.log('3. Make sure you have 2FA enabled on Gmail');
    console.log('4. Generate an App Password in Gmail settings');
  }
}

testEmailSetup().catch(console.error); 