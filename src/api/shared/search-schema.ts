import { z } from 'zod';

export const paginationQuerySchema = z.object({
  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().max(100),
});

export class PaginationResultDto<T> {
  data: T[];
  offset: number;
  limit: number;
  total: number;

  constructor({
    data,
    offset,
    limit,
    total,
  }: {
    data: T[];
    offset?: number;
    limit?: number;
    total: number;
  }) {
    this.data = data;
    this.offset = offset ?? 0;
    this.limit = limit ?? data.length - (offset ?? 0);
    this.total = total;
  }
}
