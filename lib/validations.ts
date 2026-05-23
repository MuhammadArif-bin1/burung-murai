import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8).optional(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6).optional(),
  })
  .refine(
    (value) =>
      value.confirmPassword === undefined ||
      value.password === value.confirmPassword,
    {
      message: "Konfirmasi password tidak sama.",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const birdSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  location: z.string().min(2),
  city: z.string().min(2),
  age: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]).default("UNKNOWN"),
  condition: z.string().optional(),
  status: z.enum(["AVAILABLE", "BOOKED", "SOLD"]).default("AVAILABLE"),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().min(1)).min(1),
});

export const birdPatchSchema = birdSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const categoryPatchSchema = categorySchema.partial();

export const favoriteSchema = z.object({
  birdId: z.string().min(1),
});

export const transactionSchema = z.object({
  birdId: z.string().min(1),
  note: z.string().max(500).optional(),
});

export const transactionPatchSchema = z.object({
  status: z.enum([
    "WAITING_PAYMENT",
    "WAITING_VERIFICATION",
    "PAID",
    "PROCESS",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const paymentSchema = z.object({
  transactionId: z.string().min(1),
  paymentType: z.enum(["BANK", "EWALLET"]).optional(),
  paymentLabel: z.string().min(1).optional(),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  proofImage: z.string().min(1),
  proofImageUrl: z.string().optional(),
});

export const paymentPatchSchema = z.object({
  status: z.enum(["PENDING", "WAITING_VERIFICATION", "PAID", "REJECTED"]),
  adminNote: z.string().max(500).optional(),
});

export const userPatchSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
});
