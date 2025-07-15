# Email Setup Guide for HomeGlam

This guide will help you set up genuine email functionality for password reset and welcome emails using Gmail SMTP.

## Step 1: Create a Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification
   - Scroll down and click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Name it "HomeGlam" and click "Generate"
   - **Copy the 16-character password** (you'll need this)

## Step 2: Create Environment Variables

Create a `.env` file in your `backend` folder with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/homeglam

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password_16_characters

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Replace the following:**
- `your_email@gmail.com` with your actual Gmail address
- `your_gmail_app_password_16_characters` with the 16-character app password from Step 1
- `your_jwt_secret_key_here_make_it_long_and_random` with a secure random string

## Step 3: Test Email Functionality

1. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test password reset:**
   - Go to your frontend forgot password page
   - Enter a registered email address
   - Check the email inbox for the reset link

3. **Test signup welcome email:**
   - Register a new user account
   - Check the email inbox for the welcome email

## Features Implemented

### ✅ Password Reset Email
- Beautiful HTML template with HomeGlam branding
- Secure reset link with 1-hour expiration
- Clear instructions and security warnings
- Responsive design that works on all devices

### ✅ Welcome Email
- Professional welcome message for new users
- Overview of HomeGlam features
- Branded design matching your app theme

### ✅ Error Handling
- Graceful fallback if email sending fails
- Detailed error logging for debugging
- User-friendly error messages

## Email Templates

The emails include:
- **Professional HTML design** with gradients and styling
- **HomeGlam branding** with logo and colors
- **Security features** like expiration warnings
- **Mobile-responsive** layout
- **Clear call-to-action** buttons

## Troubleshooting

### Common Issues:

1. **"Invalid login" error:**
   - Make sure you're using the App Password, not your regular Gmail password
   - Verify 2-Factor Authentication is enabled

2. **"Authentication failed" error:**
   - Check that your Gmail address is correct
   - Ensure the App Password is exactly 16 characters

3. **Emails not sending:**
   - Check your internet connection
   - Verify the `.env` file is in the correct location
   - Restart your server after changing environment variables

4. **Emails going to spam:**
   - This is normal for new email addresses
   - Add your Gmail address to the recipient's contacts
   - Check spam/junk folders

## Security Notes

- ✅ App passwords are more secure than regular passwords
- ✅ Reset tokens expire after 1 hour
- ✅ Reset tokens can only be used once
- ✅ No sensitive data is logged
- ✅ Environment variables keep credentials secure

## Alternative Email Providers

If you prefer not to use Gmail, you can modify the `createTransporter()` function in `backend/utils/sendEmail.js`:

### Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
```

### Custom SMTP:
```javascript
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
```

## Next Steps

Once email is working:
1. Test the forgot password flow end-to-end
2. Customize email templates to match your brand
3. Add email verification for new accounts (optional)
4. Set up email notifications for appointments (optional)

Your email system is now ready to send genuine emails! 🎉 