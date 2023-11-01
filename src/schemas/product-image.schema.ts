import { z } from 'zod';

const productImageSchema = z.object({
  url: z.string().trim().url(),
});

export default productImageSchema;
