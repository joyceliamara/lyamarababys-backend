import { cpf } from 'cpf-cnpj-validator';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(255),
  surname: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(10).max(15),
  cpf: z
    .string()
    .trim()
    .length(11)
    .refine((i) => cpf.isValid(i)),
  bornDate: z
    .string()
    .trim()
    .transform((i) => new Date(i))
    .refine((i) => !isNaN(i.getTime())),
});

export default contactSchema;
