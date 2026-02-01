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
  description: z.union([
    z.string().min(10, "Description must be at least 10 characters"),
    z.literal(""),
    z.undefined(),
  ]),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  location: z.string().min(1, "Location is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  storage: z.string().min(1, "Storage is required"),
  batteryHealth: z.string().optional(),
  isNegotiable: z.boolean().optional(),
  isPickupAvailable: z.boolean().optional(),
});

// Verification schemas
export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
});

export const emailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const documentUploadSchema = z.object({
  type: z.enum(["id", "passport", "driver_license"]),
  frontImage: z
    .instanceof(File, { message: "Please upload the front of your document" })
    .optional(),
  backImage: z.instanceof(File).optional(),
});
