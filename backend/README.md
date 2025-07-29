# HomeClean Backend API

A complete backend API for the HomeClean home cleaning services application built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Password reset functionality
  - Protected routes

- 🧹 **Home Cleaning Services Management**
  - CRUD operations for home cleaning services
  - Service categorization (General Cleaning, Kitchen, Bathroom, Carpet & Upholstery, Windows, Move-In/Move-Out, Sofa & Mattress, Outdoor)
  - Service pricing and descriptions

- 📅 **Appointment System**
  - Book appointments for cleaning services
  - Appointment status management
  - Email notifications for appointments

- 💳 **Payment Processing**
  - Multiple payment methods (Visa/MasterCard, PayPal, eSewa, Khalti)
  - Payment status tracking
  - Transaction history

- ⭐ **Testimonials**
  - Customer testimonials management
  - Public testimonials display

- 📧 **Email Notifications**
  - Appointment confirmations
  - Payment confirmations
  - Password reset emails

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **CORS**: Cross-Origin Resource Sharing

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password (protected)
- `POST /api/auth/request-password-reset` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password with token

### Home Cleaning Services
- `GET /api/services` - Get all cleaning services
- `GET /api/services/:id` - Get cleaning service by ID
- `GET /api/services/category/:category` - Get cleaning services by category
- `POST /api/services` - Create cleaning service (admin only)
- `PUT /api/services/:id` - Update cleaning service (admin only)
- `DELETE /api/services/:id` - Delete cleaning service (admin only)

### Appointments
- `POST /api/appointments` - Create appointment (protected)
- `GET /api/appointments` - Get user's appointments (protected)
- `GET /api/appointments/:id` - Get appointment by ID (protected)
- `PUT /api/appointments/:id/status` - Update appointment status (protected)
- `DELETE /api/appointments/:id` - Cancel appointment (protected)

### Payments
- `POST /api/payments` - Process payment (protected)
- `GET /api/payments` - Get user's payments (protected)
- `GET /api/payments/:id` - Get payment by ID (protected)
- `GET /api/payments/appointment/:appointmentId` - Get payment by appointment (protected)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/:id` - Get testimonial by ID
- `POST /api/testimonials` - Create testimonial (admin only)
- `PUT /api/testimonials/:id` - Update testimonial (admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin only)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/homeclean
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/homeclean

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=1h

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173

   # Email Configuration (for password reset and notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@homeclean.com
   ```

4. **Database Setup**
   - Start MongoDB locally or use MongoDB Atlas
   - Update the `MONGO_URI` in your `.env` file

5. **Seed the Database**
   ```bash
   npm run seed
   ```
   This will create:
   - Sample cleaning services (General Cleaning, Kitchen, Bathroom, etc.)
   - Sample testimonials
   - Default admin user (admin@homeclean.com / admin123)

6. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `resetPasswordToken`: String
- `resetPasswordExpires`: Date

### Service (Home Cleaning Service)
- `id`: String (required, unique)
- `category`: String (required)
- `name`: String (required)
- `price`: Number (required)
- `description`: String (required)
- `imageUrl`: String (required)
- `isActive`: Boolean (default: true)

### Appointment
- `userId`: ObjectId (ref: User)
- `serviceId`: String (required)
- `serviceName`: String (required)
- `date`: String (required)
- `time`: String (required)
- `status`: String (enum: ['Confirmed', 'Completed', 'Cancelled', 'Pending'])
- `customerName`: String (required)
- `customerEmail`: String (required)
- `customerPhone`: String (required)
- `message`: String
- `totalPrice`: Number (required)
- `paymentStatus`: String (enum: ['Pending', 'Paid', 'Failed'])

### Payment
- `appointmentId`: ObjectId (ref: Appointment)
- `userId`: ObjectId (ref: User)
- `amount`: Number (required)
- `paymentMethod`: String (enum: ['Visa / MasterCard', 'PayPal', 'eSewa', 'Khalti'])
- `status`: String (enum: ['Pending', 'Completed', 'Failed'])
- `transactionId`: String
- `paymentDetails`: Mixed

### Testimonial
- `name`: String (required)
- `quote`: String (required)
- `imageUrl`: String (required)
- `isActive`: Boolean (default: true)

## Email Configuration

The application sends emails for:
- Password reset requests
- Appointment confirmations
- Payment confirmations
- Appointment status updates

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

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- CORS configuration
- Input validation
- Error handling

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### File Structure
```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── serviceController.js
│   ├── appointmentController.js
│   ├── paymentController.js
│   └── testimonialController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Service.js
│   ├── Appointment.js
│   ├── Payment.js
│   └── Testimonial.js
├── routes/
│   ├── authRoutes.js
│   ├── serviceRoutes.js
│   ├── appointmentRoutes.js
│   ├── paymentRoutes.js
│   └── testimonialRoutes.js
├── utils/
│   ├── sendEmail.js
│   └── seedData.js
├── server.js
├── seed.js
└── package.json
```

## API Response Format

### Success Response
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error message (development only)"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 