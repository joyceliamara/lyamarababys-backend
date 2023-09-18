import { z } from 'zod';

const genderSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export default genderSchema;
