import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(2).max(30),
  last_name: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});
