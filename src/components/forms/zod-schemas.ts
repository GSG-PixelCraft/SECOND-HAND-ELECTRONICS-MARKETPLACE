// Zod validation schemas
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export const productSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  category: z.string(),
})