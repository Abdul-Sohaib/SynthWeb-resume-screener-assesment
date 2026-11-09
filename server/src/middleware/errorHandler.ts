import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AIServiceError } from '../services/aiService';

export function errorHandler(
  err: Error | ZodError | AIServiceError | unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed. Please check the required fields.',
        details: formattedErrors,
      },
    });
    return;
  }

  // 2. Specific AI Service Errors (Quota, Auth, Model, Malformed)
  if (err instanceof AIServiceError) {
    res.status(err.statusCode).json({
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
    return;
  }

  // 3. Known Domain Errors
  if (err instanceof Error) {
    const msg = err.message;

    if (msg.startsWith('DATABASE_SAVE_ERROR') || msg.startsWith('DATABASE_QUERY_ERROR')) {
      res.status(500).json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'A database error occurred while persisting or retrieving the analysis.',
        },
      });
      return;
    }
  }

  // 4. Fallback / Unhandled internal errors
  console.error('[ErrorHandler] Unhandled exception occurred:', err instanceof Error ? err.message : err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal error occurred. Please try again later.',
    },
  });
}
