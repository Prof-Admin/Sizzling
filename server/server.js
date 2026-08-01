require('dotenv').config();

// Validate required environment variables before anything else
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Fatal: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');
const seed = require('./config/seed');

const app = express();

// Trust Render/Heroku/Netlify reverse proxy so rate-limit sees real client IPs
app.set('trust proxy', 1);

// Connect to MongoDB then seed initial data
// Seed failure is non-fatal — server can operate without seeded defaults
connectDB()
  .then(() => seed().catch((err) => console.error('Seed warning (non-fatal):', err.message)))
  .catch((err) => {
    console.error('Fatal: Could not connect to MongoDB:', err.message);
    process.exit(1);
  });

// Security: HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://sizzling-cyan.vercel.app',
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const normalised = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(normalised)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize mongo queries
app.use(mongoSanitize());

// Prevent HTTP parameter pollution
app.use(hpp());

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// Open CORS for fully public endpoints (no auth, read-only or customer-facing)
const openCors = cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type'] });

// Routes
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/menu', openCors, require('./routes/menu'));
app.use('/api/orders', openCors, require('./routes/orders'));
app.use('/api/menu-config', openCors, require('./routes/menuConfig'));
app.use('/api/admin/auth', require('./routes/admin/auth'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboard'));
app.use('/api/admin/orders', require('./routes/admin/orders'));
app.use('/api/admin/enquiries', require('./routes/admin/enquiries'));
app.use('/api/admin/menu', require('./routes/admin/menu'));
app.use('/api/admin/invoices', require('./routes/admin/invoices'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`));
