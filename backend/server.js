const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes (use local stubs if not present)
let appointmentRoutes;
try {
	appointmentRoutes = require('./routes/appointments');
} catch (_) {
	appointmentRoutes = require('./routes.appointments.stub');
}

// Import middleware (fallbacks)
let errorHandler;
try {
	errorHandler = require('./middleware/errorHandler');
} catch (_) {
	errorHandler = (err, req, res, next) => {
		console.error(err);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	};
}

let authMiddleware;
try {
	authMiddleware = require('./middleware/auth');
} catch (_) {
	authMiddleware = (req, res, next) => next();
}

const app = express();
// Force server to run on port 5000 as requested
const PORT = 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const allowAllInDev = (process.env.NODE_ENV || 'development') === 'development';
app.use(cors({
  origin: allowAllInDev ? (origin, callback) => callback(null, true) : (process.env.CLIENT_URL || 'http://localhost:3000'),
  credentials: !allowAllInDev
}));
// Handle preflight
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/appointpro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/appointments', authMiddleware, appointmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AppointPro API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
