import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analysisRouter } from './routes/analysisRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Protect against massive payloads

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Primary API routes
app.use('/api', analysisRouter);

// Global Error Handler
app.use(errorHandler);

