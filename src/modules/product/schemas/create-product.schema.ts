import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().trim(),
  name: z.string().min(2).max(255),
  description: z.string().max(255),
  price: z.number().min(0).max(2147483647),
  discount: z.number().min(0).max(100),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
});
