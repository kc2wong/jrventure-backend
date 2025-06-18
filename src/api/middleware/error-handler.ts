import { Request, Response, NextFunction } from 'express';
import {
  BaseErrorDto,
  ErrorDto,
  NotFoundErrorDto,
  BadRequestErrorDto,
  UnAuthorizedErrorDto,
} from '@api/shared/error-schema';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof BadRequestErrorDto) {
    res.status(400).json(createErrorDto(err));
  } else if (err instanceof UnAuthorizedErrorDto) {
    res.status(401).json(createErrorDto(err));
  } else if (err instanceof NotFoundErrorDto) {
    res.status(404).json(createErrorDto(err));
  } else {
    console.error('Unexpected error:', err);
    const errorDto: ErrorDto = {
      code:
        err.message ===
        'Optimistic Locking Failed: The record was modified by another process.'
          ? 'RECORD_MODIFIED'
          : 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
    };
    res.status(500).json(errorDto);
  }
};

const createErrorDto = ({ code, parameters, message }: BaseErrorDto) => {
  return { code, parameter: parameters, message };
};
