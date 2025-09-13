import { Router } from 'express';
import weatherRoutes from './weatherRoutes';

const router = Router();

/**
 * API Routes
 * Base URL: /api
 */

// Weather routes
router.use('/weather', weatherRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Weather API v1.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      weather: {
        current: 'GET /api/weather/current',
        forecast: 'GET /api/weather/forecast',
        search: 'GET /api/weather/search'
      }
    },
    documentation: {
      current: {
        description: 'Get current weather for a location',
        parameters: {
          required: 'city (string) OR lat,lon (numbers)',
          optional: 'units (metric|imperial|kelvin)'
        },
        examples: [
          '/api/weather/current?city=London',
          '/api/weather/current?lat=40.7128&lon=-74.0060&units=imperial'
        ]
      },
      forecast: {
        description: 'Get weather forecast for a location',
        parameters: {
          required: 'city (string) OR lat,lon (numbers)',
          optional: 'days (1-5), units (metric|imperial|kelvin)'
        },
        examples: [
          '/api/weather/forecast?city=Tokyo&days=3',
          '/api/weather/forecast?lat=51.5074&lon=-0.1278&days=5'
        ]
      },
      search: {
        description: 'Get weather for multiple cities (max 10)',
        parameters: {
          required: 'cities (comma-separated string)',
          optional: 'type (current|forecast), units (metric|imperial|kelvin)'
        },
        examples: [
          '/api/weather/search?cities=London,Paris,Tokyo&type=current',
          '/api/weather/search?cities=New York,Los Angeles&type=forecast'
        ]
      }
    }
  });
});

// Health check for API routes
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Weather API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

export default router;