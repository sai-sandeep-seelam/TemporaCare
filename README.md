# 🏥 Healthcare Appointment & Medication Management System

A production-ready, full-stack web application for managing healthcare appointments and medication schedules with automated reminders.

## 🎯 Features

### 👤 User Management
- Secure authentication with JWT + refresh tokens
- User registration and login
- Profile management
- Role-based access control (Patient/Doctor)

### 📅 Appointment Management
- Book, edit, and cancel appointments
- Calendar view of upcoming appointments
- Appointment history tracking
- Doctor information (name, specialization, location)
- Status tracking (pending, confirmed, completed, cancelled)

### 💊 Medication Management
- Add medications with name, dosage, and frequency
- Set medication schedules (start & end dates)
- Track medication adherence
- Visual medication timeline

### 🔔 Reminder System
- Email notifications for appointments and medications
- In-app notification center
- Cron-based scheduled jobs
- Real-time reminder alerts

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (API client)
- React Router (routing)
- React Query (data fetching)

**Backend:**
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT authentication
- Node-cron (scheduled tasks)
- Nodemailer (email notifications)

**Security:**
- bcrypt (password hashing)
- express-rate-limit
- helmet (security headers)
- express-validator (input validation)
- CORS configuration

## 📁 Project Structure

```
healthcare-reminder-app/
├── client/                     # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Buttons, Inputs, Cards, etc.
│   │   │   ├── layout/        # Header, Footer, Sidebar
│   │   │   ├── appointments/  # Appointment-specific components
│   │   │   └── medications/   # Medication-specific components
│   │   ├── pages/             # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── Medications.jsx
│   │   │   └── Notifications.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Helper functions
│   │   ├── styles/            # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Backend application
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── medicationController.js
│   │   │   └── notificationController.js
│   │   ├── models/            # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Appointment.js
│   │   │   ├── Medication.js
│   │   │   └── Notification.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── medicationRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   └── rateLimiter.js
│   │   ├── services/          # Business logic
│   │   │   ├── emailService.js
│   │   │   ├── cronService.js
│   │   │   └── tokenService.js
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js
│   │   │   └── swagger.js
│   │   ├── utils/             # Utility functions
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql             # Database schema
│
├── .env.example               # Environment variables template
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-reminder-app
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb healthcare_db
   
   # Run the schema
   psql healthcare_db < database/schema.sql
   ```

4. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

5. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start the frontend client**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt
3. User logs in and receives:
   - Access token (15 minutes expiry)
   - Refresh token (7 days expiry)
4. Access token sent with each API request
5. When access token expires, refresh token generates new access token
6. Logout invalidates refresh token

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get specific appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Medications
- `GET /api/medications` - Get all medications
- `GET /api/medications/:id` - Get specific medication
- `POST /api/medications` - Add medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- SQL injection prevention (Sequelize ORM)
- XSS protection

## 📧 Email Notifications

Configured with Nodemailer for:
- Appointment confirmations
- Appointment reminders (24 hours before)
- Medication reminders (daily at scheduled times)
- Welcome emails

## 🔄 Scheduled Jobs

Cron jobs run for:
- Daily medication reminders (every day at 8 AM)
- Appointment reminders (24 hours before)
- Cleanup of expired notifications (weekly)

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- WCAG 2.1 AA accessibility compliant
- Loading states and error handling
- Toast notifications
- Confirmation dialogs
- Calendar view for appointments
- Dashboard with statistics
- Clean healthcare-grade interface

## 🛠️ Development

### Code Style
- ESLint configured
- Prettier formatting
- ES6+ syntax
- Async/await for asynchronous operations

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "Add: your feature description"

# Push to remote
git push origin feature/your-feature
```

## 📦 Deployment

### Backend
1. Set production environment variables
2. Build for production
3. Deploy to hosting service (Heroku, AWS, DigitalOcean)

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, AWS S3)

### Database
1. Set up PostgreSQL on cloud provider
2. Run migrations
3. Update connection string in environment variables

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@healthcare-app.com or open an issue in the repository.

## 🔮 Future Enhancements

- [ ] Video consultation integration
- [ ] Medical records upload
- [ ] Insurance integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] AI-powered health insights
- [ ] Integration with wearable devices
- [ ] Prescription refill reminders

---

**Built with ❤️ for better healthcare management**
