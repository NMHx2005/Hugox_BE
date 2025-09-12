import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://hungnguyenm985_db_user:XrkI1t83cbwTmgsy@cluster0.vuvcksl.mongodb.net/HUGOX',
  mongodbTestUri: process.env.MONGODB_TEST_URI || 'mongodb+srv://hungnguyenm985_db_user:XrkI1t83cbwTmgsy@cluster0.vuvcksl.mongodb.net/HUGOX',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-here',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',

  // Admin Configuration
  adminEmail: process.env.ADMIN_EMAIL || 'admin@hugox.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123456',

  // CORS Configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminFrontendUrl: process.env.ADMIN_FRONTEND_URL || 'http://localhost:3000/admin',

  // File Upload Configuration
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],

  // Rate Limiting Configuration
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // Increased for development

  // Email Configuration (Optional)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },

  // External APIs (Optional)
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  zaloAppId: process.env.ZALO_APP_ID || '',
  zaloAppSecret: process.env.ZALO_APP_SECRET || '',

  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  }
};

// Validate required environment variables
export const validateConfig = (): void => {
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    process.exit(1);
  }
};
