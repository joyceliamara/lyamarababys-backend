import { z } from 'zod';

const colorSchema = z.object({
  name: z.string().trim().min(1).max(255),
  code: z
    .string()
    .trim()
    .refine(
      (i) => /^#([0-9A-F]{3}){1,2}$/i.test(i),
      'The color code is invalid',
    ),
});

export default colorSchema;
