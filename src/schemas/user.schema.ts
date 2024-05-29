import { z } from 'zod';

const userSchema = z.object({
  name: z.string().trim().min(2).max(50),
  surname: z.string().trim().min(2).max(50),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().trim().min(6).max(255),
});

export default userSchema;
