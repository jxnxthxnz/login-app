import express, { Application } from 'express'; //{} for named exports
import cors from 'cors'; //control which domains allowed to make request to this api
import helmet from 'helmet'; //sets a bunch of http security headers
import morgan from 'morgan'; //request logger
import cookieParser from 'cookie-parser'; //parse cookies from incoming requests
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS, //only those in allowed_origins can call (frontend url)
    credentials: true, //allow cookies & auth headers to be sent cross origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], //restrict header type, json bodies and bearer tokens
  })
);

// Body parsing middleware
app.use(express.json()); //parse raw request body into json and attach to req.body
app.use(express.urlencoded({ extended: true })); //parse html form submissions, supports nested
app.use(cookieParser()); //parse cookie string

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, //time window to count requests
  max: env.RATE_LIMIT_MAX_REQUESTS, //max requests in window
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true, //add rate limit headers to response for client
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoint
// health handler, callback when request comes in
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', routes); // routes already include /auth prefix

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
