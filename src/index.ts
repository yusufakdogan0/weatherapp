import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { weatherRouter } from './routes/weather';
import { authRouter } from './routes/auth';

// Load environment variables
config();

const app = express();
const port = process.env.PORT ? 
  Number(process.env.PORT) : 
  3000; // Default port if not set

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Rate limiting
const rateLimitWindowMs = process.env.RATE_LIMIT_WINDOW_MS ? 
  Number(process.env.RATE_LIMIT_WINDOW_MS) : 
  15 * 60 * 1000; // Default: 15 minutes

const rateLimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS ? 
  Number(process.env.RATE_LIMIT_MAX_REQUESTS) : 
  100; // Default: 100 requests

const limiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMaxRequests
});

app.use(limiter);

// Routes
app.use('/api/weather', weatherRouter);
app.use('/api/auth', authRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});