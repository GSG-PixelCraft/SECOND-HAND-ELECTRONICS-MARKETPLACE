// Zod validation schemas
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  category: z.string(),
});

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  location: z.string().min(1, "Location is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  storage: z.string().optional(),
  batteryHealth: z.string().optional(),
  isNegotiable: z.boolean().optional(),
  confirmNotStolen: z.boolean().optional(),
});
