import { z } from 'zod';

export class ZodErrorObject {
  code: string;
  message: string;
  parameters?: string[];

  constructor(code: string, message: string, parameters?: string[]) {
    this.code = code;
    this.message = message;
    this.parameters = parameters ?? [];
  }
}

export const errorMessageRequired = {
  message: JSON.stringify(
    new ZodErrorObject('zod.error.Required', 'Must have value')
  ),
};

export const errorMessageNotRequired = {
  message: JSON.stringify(
    new ZodErrorObject('zod.error.NotRequired', 'Cannot have value')
  ),
};

export const errorMessageTooShort = (minLength: number) => {
  return {
    message: JSON.stringify(
      new ZodErrorObject(
        'zod.error.TooShort',
        `Mimimum length is ${minLength}`,
        [`${minLength}`]
      )
    ),
  };
};

export const errorMessageTooLong = (maxLength: number) => {
  return {
    message: JSON.stringify(
      new ZodErrorObject(
        'zod.error.TooLong',
        `Maximum length is ${maxLength}`,
        [`${maxLength}`]
      )
    ),
  };
};

export const errorMessageTooEarly = (minDate: Date) => {
  return {
    message: JSON.stringify(
      new ZodErrorObject(
        'zod.error.TooEarly',
        `Mimimum value is ${minDate.toISOString()}`,
        [`${minDate.toISOString()}`]
      )
    ),
  };
};

export const errorMessageTooLate = (maxDate: Date) => {
  return {
    message: JSON.stringify(
      new ZodErrorObject(
        'zod.error.TooLate',
        `Maximum value is ${maxDate.toISOString()}`,
        [`${maxDate.toISOString()}`]
      )
    ),
  };
};

export const errorMessageTooSmall = (minValue: number) => {
  return {
    message: JSON.stringify(
      new ZodErrorObject(
        'zod.error.TooSmall',
        `Mimimum number is ${minValue}`,
        [`${minValue}`]
      )
    ),
  };
};

export const errorMessageTooLarge = (maxValue: number) => {
  return {
    message: JSON.stringify(
      new ZodErrorObject(
        'zod.error.TooLarge',
        `Maximum number is ${maxValue}`,
        [`${maxValue}`]
      )
    ),
  };
};

export const errorMessageOutOfRange = (minValue: number, maxValue: number) => {
  return {
    message: JSON.stringify(
      new ZodErrorObject(
        'zod.error.OutOfRange',
        `Value must be between ${minValue} and ${maxValue}`,
        [`${minValue}`, `${maxValue}`]
      )
    ),
  };
};

export const zodStringBase = (options?: {
  minLength?: number;
  maxLength?: number;
}) => {
  let schema = z.string(errorMessageRequired);

  if (options?.minLength !== undefined) {
    schema = schema.min(
      options.minLength,
      errorMessageTooShort(options.minLength)
    );
  }

  if (options?.maxLength !== undefined) {
    schema = schema.max(
      options.maxLength,
      errorMessageTooLong(options.maxLength)
    );
  }
  return schema;
};

export const zodEmail = (options?: { maxLength?: number }) => {
  const schema = zodStringBase(options).email({
    message: JSON.stringify(
      new ZodErrorObject('zod.error.InvalidEmail', 'Invalid email address')
    ),
  });
  return schema.refine(
    (v) => v !== undefined && v.trim().length > 0,
    errorMessageRequired
  );
};

export const zodOptionalEmail = (options?: { maxLength?: number }) => {
  return z
    .string()
    .superRefine((val, ctx) => {
      if (val.trim().length > 0) {
        const result = zodEmail(options).safeParse(val);

        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue(issue); // forward exact issue from zodEmail
          }
        }
      }
    })
    .transform((val) => (val.trim().length === 0 ? undefined : val))
    .optional();
};

export const zodBoolean = () => {
  return z
    .any()
    .refine((val) => val !== undefined, {
      message: JSON.stringify(
        new ZodErrorObject('zod.error.Required', 'Must have value')
      ),
    })
    .refine(
      (val) =>
        val === true || val === false || val === 'true' || val === 'false',
      {
        message: JSON.stringify(
          new ZodErrorObject(
            'zod.error.InvalidValue',
            'Must be "true" or "false"'
          )
        ),
      }
    )
    .transform((val) => val === true || val === 'true');
};

export const zodOptionalBoolean = () =>
  z
    .any()
    .refine(
      (val) =>
        val === undefined ||
        val === '' ||
        typeof val === 'boolean' ||
        val === 'true' ||
        val === 'false',
      {
        message: JSON.stringify(
          new ZodErrorObject(
            'zod.error.InvalidValue',
            'Must be "true" or "false"'
          )
        ),
      }
    )
    .transform((val) => {
      if (val === undefined || val === '') return undefined;
      return val === true || val === 'true';
    })
    .optional();

export const zodString = (options?: {
  minLength?: number;
  maxLength?: number;
}) => {
  const schema = zodStringBase(options);
  return schema.refine(
    (v) => v !== undefined && v.trim().length > 0,
    errorMessageRequired
  );
};

export const zodOptionalString = (options?: {
  minLength?: number;
  maxLength?: number;
}) => {
  return z
    .string()
    .superRefine((val, ctx) => {
      if (val.trim().length > 0) {
        const result = zodString(options).safeParse(val);

        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue(issue); // forward exact issue from zodString
          }
        }
      }
    })
    .transform((val) => (val.trim().length === 0 ? undefined : val))
    .optional();
};

export const zodDate = (options?: { minValue?: Date; maxValue?: Date }) => {
  return zodStringBase()
    .refine((val) => val.trim().length > 0, errorMessageRequired)
    .refine(
      (val) => {
        return !isNaN(Date.parse(val));
      },
      {
        message: JSON.stringify(
          new ZodErrorObject(
            'zod.error.InvalidDate',
            'Invalid ISO datetime string'
          )
        ),
      }
    )
    .refine(
      (val) => {
        if (options?.minValue) {
          return new Date(val) >= options.minValue;
        }
        return true;
      },
      options?.minValue ? errorMessageTooEarly(options.minValue) : ''
    )
    .refine(
      (val) => {
        if (options?.maxValue) {
          return new Date(val) <= options.maxValue;
        }
        return true;
      },
      options?.maxValue ? errorMessageTooLate(options.maxValue) : ''
    );
};

export const zodOptionalDate = (options?: {
  minValue?: Date;
  maxValue?: Date;
}) => {
  return z
    .string()
    .superRefine((val, ctx) => {
      if (val.trim().length > 0) {
        const result = zodDate(options).safeParse(val);

        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue(issue); // forward exact issue from zodEmail
          }
        }
      }
    })
    .transform((val) => (val.trim().length === 0 ? undefined : val))
    .optional();
};

type ZodNumberOptions = {
  min?: number;
  max?: number;
  default?: number;
  isDecimal?: boolean;
  decimalPlaces?: number;
};

export const zodNumber = (options?: ZodNumberOptions) => {
  const min = options?.min;
  const max = options?.max;
  const decimalPlaces = options?.decimalPlaces;
  const isDecimal = options?.isDecimal ?? true;

  let schema = z.coerce.number(errorMessageRequired);

  if (min !== undefined) {
    schema = schema.min(min, errorMessageTooSmall(min));
  }

  if (max !== undefined) {
    schema = schema.max(max, errorMessageTooLarge(max));
  }

  if (decimalPlaces !== undefined || isDecimal === false) {
    const numberOfDecimal = isDecimal !== true ? 0 : decimalPlaces;

    return schema.refine(
      (val) => {
        const decimalPart = val.toString().split('.')[1];
        const numDecimals = decimalPart ? decimalPart.length : 0;

        // Reject decimals if isDecimal === false
        if (isDecimal === false && !Number.isInteger(val)) {
          return false;
        }

        // Restrict decimal places if specified
        if (decimalPlaces !== undefined && numDecimals > decimalPlaces) {
          return false;
        }

        return true;
      },
      {
        message: JSON.stringify(
          new ZodErrorObject(
            'zod.error.InvalidNumber',
            `Must be a number with ${numberOfDecimal ?? 'any'} decimal places`,
            [`${numberOfDecimal ?? 'any'}`]
          )
        ),
      }
    );
  }
  return schema;
};

export const zodOptionalNumber = (options?: ZodNumberOptions) => {
  return z
    .string()
    .superRefine((val, ctx) => {
      if (val.trim().length > 0) {
        const result = zodNumber(options).safeParse(val);

        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue(issue); // forward exact issue from zodNumber
          }
        }
      }
    })
    .transform((val) => (val.trim().length === 0 ? undefined : val))
    .optional();
};

export const zodEnum = <const T extends [string, ...string[]]>(
  values: T
): z.ZodEnum<T> => {
  return z.enum(values, {
    errorMap: () => ({
      message: JSON.stringify(
        new ZodErrorObject(
          'zod.error.InvalidValue',
          `Value must be one of: ${values.join(', ')}`,
          values
        )
      ),
    }),
  });
};

export const zodOptionalEnum = <T extends [string, ...string[]]>(values: T) => {
  const baseEnum = zodEnum(values);
  return z
    .any()
    .superRefine((val, ctx) => {
      if (val === undefined) return;

      const result = baseEnum.safeParse(val);
      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue(issue); // 🔁 forward all issues from baseEnum
        }
      }
    })
    .transform((val) => (val === undefined ? undefined : (val as T[number])));
};
