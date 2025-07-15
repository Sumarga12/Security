# HomeGlam Complete Setup Guide

This guide will help you set up both the frontend and backend for the HomeGlam beauty services application.

## 🏗️ Project Structure

```
UIux/
├── backend/                 # Backend API (Node.js + Express + MongoDB)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── homeglamworking/         # Frontend (React + TypeScript + Vite)
    ├── src/
    ├── pages/
    ├── components/
    ├── contexts/
    ├── data/
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Environment Configuration
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/homeglam
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/homeglam

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (for password reset and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@homeglam.com
```

#### Step 4: Database Setup
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Create a cluster and get your connection string

#### Step 5: Seed the Database
```bash
npm run seed
```
This creates:
- Sample services (Makeup, Hair, Skincare, Spa, Waxing)
- Sample testimonials
- Default admin user (admin@homeglam.com / admin123)

#### Step 6: Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be running on `http://localhost:5000`

### 2. Frontend Setup

#### Step 1: Navigate to frontend directory
```bash
cd homeglamworking
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Environment Configuration
Create a `.env` file in the homeglamworking directory:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=HomeGlam
VITE_APP_VERSION=1.0.0
```

#### Step 4: Start Frontend Development Server
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 🔧 Configuration Details

### Backend Configuration

#### Database Models
- **User**: Authentication and user management
- **Service**: Beauty services with categories and pricing
- **Appointment**: Booking system with status tracking
- **Payment**: Payment processing and transaction history
- **Testimonial**: Customer reviews and testimonials

#### API Endpoints

**Authentication (`/api/auth`)**
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /change-password` - Change password (protected)
- `POST /request-password-reset` - Request password reset
- `PUT /reset-password/:token` - Reset password with token

**Services (`/api/services`)**
- `GET /` - Get all services
- `GET /:id` - Get service by ID
- `GET /category/:category` - Get services by category
- `POST /` - Create service (admin only)
- `PUT /:id` - Update service (admin only)
- `DELETE /:id` - Delete service (admin only)

**Appointments (`/api/appointments`)**
- `POST /` - Create appointment (protected)
- `GET /` - Get user's appointments (protected)
- `GET /:id` - Get appointment by ID (protected)
- `PUT /:id/status` - Update appointment status (protected)
- `DELETE /:id` - Cancel appointment (protected)

**Payments (`/api/payments`)**
- `POST /` - Process payment (protected)
- `GET /` - Get user's payments (protected)
- `GET /:id` - Get payment by ID (protected)
- `GET /appointment/:appointmentId` - Get payment by appointment (protected)

**Testimonials (`/api/testimonials`)**
- `GET /` - Get all testimonials
- `GET /:id` - Get testimonial by ID
- `POST /` - Create testimonial (admin only)
- `PUT /:id` - Update testimonial (admin only)
- `DELETE /:id` - Delete testimonial (admin only)

### Frontend Configuration

#### API Integration
The frontend includes complete API integration files:
- `src/api/index.ts` - Base API configuration
- `src/api/auth.ts` - Authentication API functions
- `src/api/services.ts` - Services API functions
- `src/api/appointments.ts` - Appointments API functions
- `src/api/payments.ts` - Payments API functions
- `src/api/testimonials.ts` - Testimonials API functions

#### Context Providers
- `AuthContext` - User authentication and management
- `CartContext` - Shopping cart functionality
- `NotificationContext` - Toast notifications

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your `.env` file

### SendGrid Setup (Alternative)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 🔐 Security Features

### Backend Security
- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- CORS configuration
- Input validation
- Error handling

### Frontend Security
- Token-based authentication
- Protected routes
- Secure API communication
- Input sanitization

## 🧪 Testing the Setup

### 1. Health Check
Visit `http://localhost:5000/api/health` to verify backend is running.

### 2. Database Connection
Check console logs for MongoDB connection status.

### 3. Frontend-Backend Connection
- Open frontend at `http://localhost:5173`
- Try to register/login
- Browse services
- Make an appointment

### 4. Default Credentials
- **Admin User**: admin@homeglam.com / admin123
- **Test User**: Create a new account through the signup form

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or other cloud database
2. Configure environment variables for production
3. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to platforms like:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure network access for Atlas

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if frontend is running on correct port

3. **Email Not Sending**
   - Verify email credentials in `.env`
   - Check if 2FA is enabled for Gmail
   - Use App Password instead of regular password

4. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token expiration settings

### Development Tips

1. **Use nodemon for backend development**
   ```bash
   npm run dev
   ```

2. **Check API responses in browser dev tools**
   - Network tab for API calls
   - Console for errors

3. **Database debugging**
   - Use MongoDB Compass for database inspection
   - Check server logs for database errors

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review console logs for errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

---

**Happy coding! 🎉** 