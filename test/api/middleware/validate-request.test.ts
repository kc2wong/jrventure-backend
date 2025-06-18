import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import {
  validateQuery,
  validateRequest,
} from '@api/middleware/validate-request';
import { zodOptionalEmail } from '@type/zod';

const schema = z.object({
  email: zodOptionalEmail(),
  limit: z.coerce.number().min(1).max(100),
  offset: z.coerce.number().min(0).default(0),
});

describe('validateQuery middleware', () => {
  it('should call next() if query is valid', () => {
    const req = { query: { limit: '10', offset: '5' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    const middleware = validateQuery(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.query).toEqual({ limit: 10, offset: 5 }); // transformed values
  });

  it('should return 400 if query is invalid', () => {
    const req = { query: { limit: '-1' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    const middleware = validateQuery(schema);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.stringMatching('INVALID_VALUE'),
        message: expect.stringMatching(
          'Number must be greater than or equal to 1'
        ),
        parameter: [],
      })
    );
  });
});

describe('validateRequest middleware', () => {
  it('should call next() if request body is valid', () => {
    const req = { body: { limit: '10', offset: '5' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    const middleware = validateRequest(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.body).toEqual({ limit: 10, offset: 5 }); // transformed values
  });

  it('should return 400 with zod message if request body is invalid', () => {
    const req = { body: { limit: '-1' } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    const middleware = validateRequest(schema);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.stringMatching('INVALID_VALUE'),
        message: expect.stringMatching(
          'Number must be greater than or equal to 1'
        ),
        parameter: [],
      })
    );
  });

  it('should return 400 with custom message if request body is invalid', () => {
    const req = { body: { email: 'invalid@gmail', limit: 1 } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    const middleware = validateRequest(schema);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.stringMatching('zod.error.InvalidEmail'),
        message: expect.stringMatching('Invalid email address'),
        parameter: expect.arrayContaining(['email']),
      })
    );
  });
});
