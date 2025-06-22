import { Request, Response, NextFunction } from 'express';
import { z, ZodIssue, ZodSchema } from 'zod';

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

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = zodIssue2Error(result.error.issues[0]);
      res.status(400).json({ ...error });
      return;
    }

    Object.defineProperty(req, 'body', {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
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
