import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalido'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Minimo 8 caracteres').max(72, 'Maximo 72 caracteres'),
  confirmPassword: z.string().min(8, 'Minimo 8 caracteres').max(72, 'Maximo 72 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contrasenas no coinciden',
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
  phone: z.string().min(7, 'Telefono invalido'),
});

export const customerFormSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(7, 'Telefono invalido'),
  notes: z.string().optional(),
});

export const shippingAddressSchema = z.object({
  address: z.string().min(5, 'Direccion invalida'),
  reference: z.string().optional(),
  city: z.string().min(2, 'Ciudad invalida'),
});

export const checkoutFormSchema = customerFormSchema.merge(shippingAddressSchema);

export const createStoreSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  slug: z.string()
    .min(3, 'Minimo 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo letras, numeros y guiones'),
  description: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CustomerFormData = z.infer<typeof customerFormSchema>;
export type ShippingAddressData = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
