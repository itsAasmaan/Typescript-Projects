import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      details: 'Rate limit exceeded. Please wait before making more requests.'
    },
    timestamp: new Date().toISOString()
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    const resetTime = new Date(Date.now() + parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'));
    
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        details: `Rate limit exceeded. Try again after ${resetTime.toISOString()}`
      },
      timestamp: new Date().toISOString(),
      meta: {
        rateLimit: {
          remaining: 0,
          resetTime: resetTime.toISOString(),
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
        }
      }
    });
  }
});


export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window (half of general limit)
  message: {
    success: false,
    error: {
      code: 'STRICT_RATE_LIMIT_EXCEEDED',
      message: 'Too many resource-intensive requests. Please try again later.',
      details: 'This endpoint has stricter rate limits due to higher resource usage.'
    },
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = new Date(Date.now() + (15 * 60 * 1000));
    
    res.status(429).json({
      success: false,
      error: {
        code: 'STRICT_RATE_LIMIT_EXCEEDED',
        message: 'Too many resource-intensive requests. Please try again later.',
        details: `Strict rate limit exceeded. Try again after ${resetTime.toISOString()}`
      },
      timestamp: new Date().toISOString(),
      meta: {
        rateLimit: {
          remaining: 0,
          resetTime: resetTime.toISOString(),
          windowMs: 15 * 60 * 1000
        }
      }
    });
  }
});

export const bulkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Only 20 bulk requests per window
  message: {
    success: false,
    error: {
      code: 'BULK_RATE_LIMIT_EXCEEDED',
      message: 'Too many bulk requests. Please try again later.',
      details: 'Bulk operations have very strict rate limits to ensure fair usage.'
    },
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
    handler: (req, res) => {
    const resetTime = new Date(Date.now() + (15 * 60 * 1000));
    
    res.status(429).json({
      success: false,
      error: {
        code: 'BULK_RATE_LIMIT_EXCEEDED',
        message: 'Too many bulk requests. Please try again later.',
        details: `Bulk rate limit exceeded. Try again after ${resetTime.toISOString()}`
      },
      timestamp: new Date().toISOString(),
      meta: {
        rateLimit: {
          remaining: 0,
          resetTime: resetTime.toISOString(),
          windowMs: 15 * 60 * 1000
        }
      }
    });
  }
});