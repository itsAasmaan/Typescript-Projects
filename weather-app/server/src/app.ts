import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString( ),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API middleware
app.use('/api', (req, res) => {
  res.status(200).json({
    message: 'Weather API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      weather: '/api/weather (coming soon)'
    }
  });
});

export default app;