import { Request, Response, NextFunction } from 'express';

/**
 * Custom request logger middleware
 * Logs API requests with timing and basic info
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`   Query: ${JSON.stringify(req.query)}`);
  }
  
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    const logSymbol = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
    
    console.log(`${logSymbol} [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${statusCode} (${duration}ms)`);
    
    return originalJson.call(this, body);
  };
  
  next();
};

/**
 * Error request logger
 * Logs requests that result in errors
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  
  console.error(`🚨 [${timestamp}] ERROR in ${req.method} ${req.originalUrl}`);
  console.error(`   Error: ${err.message}`);
  console.error(`   Stack: ${err.stack}`);
  
  next(err);
};