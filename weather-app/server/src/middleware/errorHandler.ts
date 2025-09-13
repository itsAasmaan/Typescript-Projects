import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();

  // Log error details
  console.error(`[${timestamp}] Global Error Handler:`);
  console.error(`Path: ${req.method} ${req.originalUrl}`);
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error(`Query: ${JSON.stringify(req.query)}`);
  console.error(`Body: ${JSON.stringify(req.body)}`);
  console.error(`Headers: ${JSON.stringify(req.headers)}`);

  // Don't send error response if headers are already sent
  if (res.headersSent) {
    return next(err);
  }

  // Default error response
  let statusCode = 500;
  let errorCode = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred";
  let details =
    "Please try again later or contact support if the problem persists";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = "Request validation failed";
    details = err.message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    errorCode = "INVALID_FORMAT";
    message = "Invalid data format";
    details = "One or more parameters have invalid format";
  } else if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
    statusCode = 503;
    errorCode = "SERVICE_UNAVAILABLE";
    message = "External service unavailable";
    details = "Weather service is temporarily unavailable";
  } else if (err.code === "ETIMEDOUT") {
    statusCode = 504;
    errorCode = "GATEWAY_TIMEOUT";
    message = "Request timeout";
    details = "The request took too long to complete";
  } else if (err.message) {
    // Use error message to determine appropriate response
    if (err.message.includes("API key")) {
      statusCode = 401;
      errorCode = "INVALID_API_KEY";
      message = "Authentication failed";
      details = "Invalid or missing API key";
    } else if (err.message.includes("not found")) {
      statusCode = 404;
      errorCode = "NOT_FOUND";
      message = "Resource not found";
      details = err.message;
    } else if (err.message.includes("rate limit")) {
      statusCode = 429;
      errorCode = "RATE_LIMIT_EXCEEDED";
      message = "Rate limit exceeded";
      details = err.message;
    } else if (process.env.NODE_ENV === "development") {
      // In development, include the actual error message
      message = err.message;
      details = err.stack;
    }
  }

  const errorId = `err_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: details,
      errorId: errorId,
    },
    timestamp: timestamp,
    meta: {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      path: `${req.method} ${req.originalUrl}`,
      userAgent: req.get("User-Agent") || "unknown",
    },
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Endpoint not found",
      details: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    },
    timestamp: timestamp,
    meta: {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      availableEndpoints: {
        weather: {
          current: "GET /api/weather/current",
          forecast: "GET /api/weather/forecast",
          search: "GET /api/weather/search",
        },
        system: {
          health: "GET /health",
          apiHealth: "GET /api/health",
          apiInfo: "GET /api",
        },
      },
    },
  });
};

export const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
