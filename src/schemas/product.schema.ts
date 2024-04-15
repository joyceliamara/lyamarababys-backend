import { z } from 'zod';

const productSchema = z.object({
  name: z.string().trim().min(1).max(255),
  subtitle: z.string().trim().min(1).max(255),
  composition: z.string().trim().min(1).max(255),
  sku: z.string().trim().min(1).max(100),
  price: z.number().min(0).max(3.4e38),
  discount: z.number().min(0).max(100).default(0),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  quantities: z.number(),
  images: z.array(
    z.object({
      url: z.string().trim().url(),
      main: z.boolean(),
    }),
  ),
});

export default productSchema;
