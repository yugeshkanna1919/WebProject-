# Appointment Management System

A comprehensive MERN stack application for managing appointments efficiently. This system allows users to create, view, edit, and delete appointments with a modern, responsive interface.

## 🚀 Features

- **Appointment Management**: Create, read, update, and delete appointments
- **Client Information**: Store and manage client details
- **Status Tracking**: Track appointment status (scheduled, confirmed, cancelled, completed)
- **Search & Filter**: Search appointments by title, client name, or email
- **Date & Time Management**: Schedule appointments with specific dates and times
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Date-fns** - Date utility library
- **React DatePicker** - Date picker component

## 📁 Project Structure

```
appointment-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── index.js          # Appointment & user controllers
│   │   ├── models/
│   │   │   └── index.js          # MongoDB schemas
│   │   ├── routes/
│   │   │   └── index.js          # API routes
│   │   └── app.js                # Express server setup
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx           # Main app component
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   ├── App.css           # Global styles
│   │   │   └── Navbar.css        # Navigation styles
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Home page
│   │   │   ├── Home.css          # Home page styles
│   │   │   ├── AppointmentList.jsx    # Appointments list
│   │   │   ├── AppointmentList.css    # List styles
│   │   │   ├── CreateAppointment.jsx  # Create form
│   │   │   ├── CreateAppointment.css  # Form styles
│   │   │   ├── EditAppointment.jsx    # Edit form
│   │   │   └── index.js          # React entry point
│   │   └── App.css               # Global styles
│   ├── package.json
│   └── README.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appointment-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - The application will connect to `mongodb://localhost:27017/appointment-system`

2. **Environment Variables** (Optional)
   - Create a `.env` file in the backend directory if needed
   - Default port is 5000 for backend, 3000 for frontend

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```
   The application will open on `http://localhost:3000`

## 📡 API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/range?startDate=&endDate=` - Get appointments by date range
- `GET /api/appointments/status/:status` - Get appointments by status

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## 🎯 Usage

### Creating an Appointment
1. Navigate to "New Appointment" from the navigation
2. Fill in the appointment details:
   - Title and description
   - Date and time
   - Duration
   - Client information
   - Notes (optional)
3. Click "Create Appointment"

### Managing Appointments
1. View all appointments on the "Appointments" page
2. Use search and filter options to find specific appointments
3. Click "Edit" to modify an appointment
4. Click "Delete" to remove an appointment

### Features
- **Search**: Search by appointment title, client name, or email
- **Filter**: Filter by appointment status
- **Sort**: Appointments are automatically sorted by date and time
- **Responsive**: Works on all device sizes

## 🎨 UI Components

- **Navigation Bar**: Sticky navigation with active state indicators
- **Appointment Cards**: Clean card layout with status indicators
- **Forms**: Comprehensive forms with validation
- **Buttons**: Consistent button styling with loading states
- **Status Badges**: Color-coded status indicators

## 🔧 Development

### Backend Development
- The backend uses Express.js with MongoDB
- Controllers handle business logic
- Models define data schemas
- Routes define API endpoints

### Frontend Development
- React components are organized by feature
- CSS modules for component-specific styling
- Responsive design with mobile-first approach
- Form validation and error handling

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Build the application
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy the build folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- User authentication and authorization
- Email notifications
- Calendar integration
- Recurring appointments
- Advanced reporting and analytics
- Multi-language support
- Dark mode theme