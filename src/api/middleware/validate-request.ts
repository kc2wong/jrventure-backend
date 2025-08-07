import { Request, Response, NextFunction } from 'express';
import { z, ZodIssue, ZodSchema } from 'zod';

import { logger } from '@util/logging-util';

const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
  parameters: z.array(z.string()).optional(),
});

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const error = zodIssue2Error(result.error.issues[0]);
      res.status(400).json({ ...error });
      return; // ✅ Ensure you explicitly return
    }
    Object.defineProperty(req, 'query', {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next(); // ✅ Make sure this is the final call
  };
};

type ZodParseResult =
  | { success: true; data: any }
  | { success: false; error: ZodIssue };

export const validateSchema = (
  schema: ZodSchema,
  body: any
): ZodParseResult => {
  const result = schema.safeParse(body);

  if (!result.success) {
    logger.warn(`Validation failed: ${JSON.stringify(result.error)}`);
    return { success: false, error: result.error.issues[0] };
  } else {
    return { success: true, data: result.data };
  }
};

export const validateRequest = (schema: ZodSchema | ZodSchema[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const results = Array.isArray(schema)
      ? schema.map((schema) => validateSchema(schema, req.body))
      : [validateSchema(schema, req.body)];
    const successfulResult = results.filter((result) => result.success)[0];
    const failedResult = results.filter(
      (result) => result.success === false
    )[0];
    if (successfulResult) {
      Object.defineProperty(req, 'body', {
        value: successfulResult.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next();
    } else if (failedResult) {
      logger.warn(`Validation failed: ${JSON.stringify(failedResult.error)}`);
      const error = zodIssue2Error(failedResult.error);
      res.status(400).json({ ...error });
      return;
    }
  };
};

const attemptParseJson = (str: string): object | string => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

const zodIssue2Error = (issue: ZodIssue): object => {
  const { path, message } = issue;
  const jsonOrString = attemptParseJson(message);

  if (jsonOrString === message) {
    return {
      code: 'INVALID_VALUE',
      message,
      parameter: [],
    };
  } else {
    const parseErrorResult = errorSchema.safeParse(jsonOrString);
    return {
      code: parseErrorResult.success
        ? parseErrorResult.data.code
        : 'INVALID_VALUE',
      parameter: parseErrorResult.success
        ? [...path, ...(parseErrorResult.data.parameters ?? [])]
        : [],
      message: parseErrorResult.success
        ? parseErrorResult.data.message
        : message,
    };
  }
};
