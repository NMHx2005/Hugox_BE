import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config, validateConfig } from './config/config';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import newsRoutes from './routes/news';
import reviewRoutes from './routes/reviews';
import contactRoutes from './routes/contact';
import uploadRoutes from './routes/upload';
import searchRoutes from './routes/search';
import filterRoutes from './routes/filters';
import mobileRoutes from './routes/mobile';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';

const app = express();

// Validate configuration
validateConfig();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [config.frontendUrl, config.adminFrontendUrl],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting - Different limits for development and production
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.nodeEnv === 'development' ? 1000 : config.rateLimitMaxRequests, // Higher limit for development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Create public limiter at initialization
const publicLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.nodeEnv === 'development' ? 2000 : 500, // Higher limit for public routes
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
// Thêm route cho root path
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HUGOX API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      health: '/health',
      docs: '/api-docs'
    }
  });
});
// Apply rate limiting to all routes except public routes
app.use((req, res, next) => {
  // More lenient rate limiting for public routes
  if (req.path.startsWith('/api/public/')) {
    return publicLimiter(req, res, next);
  }

  // Apply normal rate limiting for other routes
  return limiter(req, res, next);
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/mobile', mobileRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📱 Frontend URL: ${config.frontendUrl}`);
      console.log(`🔧 Admin URL: ${config.adminFrontendUrl}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

export default app;
