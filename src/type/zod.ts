import { z } from 'zod';

export const zodEmail = (options?: { maxLength?: number }) => {
  let schema = z.string().email({ message: 'zod.error.InvalidEmail' });

  if (options?.maxLength !== undefined) {
    schema = schema.max(options.maxLength);
  }

  return schema.refine((v) => v.trim().length > 0, {
    message: 'zod.error.Required',
  });
};

export const zodOptionalEmail = (options?: { maxLength?: number }) => {
  let schema = z.string().email();

  if (options?.maxLength !== undefined) {
    schema = schema.max(options.maxLength);
  }

  return schema.optional();
};

export const zodBoolean = () => {
  return z.boolean({
    required_error: 'zod.error.Required',
  });
};

export const zodString = (options?: {
  minLength?: number;
  maxLength?: number;
}) => {
  let schema = z.string();

  if (options?.minLength !== undefined) {
    schema = schema.min(options.minLength);
  }

  if (options?.maxLength !== undefined) {
    schema = schema.max(options.maxLength);
  }

  return schema.refine((v) => v.trim().length > 0, {
    message: 'zod.error.Required',
  });
};

export const zodOptionalString = (options?: {
  minLength?: number;
  maxLength?: number;
}) => {
  let schema = z.string();

  if (options?.minLength !== undefined) {
    schema = schema.min(options.minLength);
  }

  if (options?.maxLength !== undefined) {
    schema = schema.max(options.maxLength);
  }

  return schema.optional();
};

export const zodDate = (options?: { minValue?: Date; maxValue?: Date }) => {
  let schema = z.string();

  return schema
    .refine((v) => !isNaN(new Date(v.trim()).getTime()), {
      message: 'zod.error.InvalidDate',
    })
    .refine(
      (v) => {
        if (options?.minValue === undefined) return true;
        const dateValue = new Date(v.trim()).getTime();
        return dateValue >= options.minValue.getTime();
      },
      {
        message: 'zod.error.TooSmall',
        params: {
          value: options?.minValue?.toISOString(),
        },
      }
    )
    .refine(
      (v) => {
        if (options?.maxValue === undefined) return true;
        const dateValue = new Date(v.trim()).getTime();
        return dateValue <= options.maxValue.getTime();
      },
      {
        message: 'zod.error.TooLarge',
        params: {
          value: options?.maxValue?.toISOString(),
        },
      }
    );
};

export const zodNumber = (options?: {
  minValue?: number;
  maxValue?: number;
}) => {
  return z
    .number()
    .refine(
      (v) => {
        return options?.minValue === undefined || v >= options.minValue;
      },
      {
        message: 'zod.error.TooSmall',
        params: {
          value: options?.minValue,
        },
      }
    )
    .refine(
      (v) => {
        return options?.maxValue === undefined || v <= options.maxValue;
      },
      {
        message: 'zod.error.TooLarge',
        params: {
          value: options?.maxValue,
        },
      }
    );
};
