import { z } from 'zod';

const userSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().trim().min(6).max(255),
});

export default userSchema;
