import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export default categorySchema;
