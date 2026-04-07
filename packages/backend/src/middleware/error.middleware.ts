import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError, //either of these types
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        //only validation error has details
        details: 'details' in err ? err.details : undefined,
      },
    });
    return;
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
};

//non existing routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  });
};
