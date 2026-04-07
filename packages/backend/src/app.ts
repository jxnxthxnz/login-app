import express, { Application } from 'express'; //{} for named exports
import cors from 'cors'; //control which domains allowed to make request to this api
import helmet from 'helmet'; //sets a bunch of http security headers
import morgan from 'morgan'; //request logger
import cookieParser from 'cookie-parser'; //parse cookies from incoming requests
import rateLimit from 'express-rate-limit'; 
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS, //only those in allowed_origins can call
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], //restrict header type
  })
);

// Body parsing middleware
app.use(express.json()); //parse incoming request bodies and place in req.body
app.use(express.urlencoded({ extended: true })); //parse form encoded bodies
app.use(cookieParser());

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
