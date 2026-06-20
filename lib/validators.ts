import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Minimo 8 caracteres').max(72, 'Maximo 72 caracteres'),
  confirmPassword: z.string().min(8, 'Minimo 8 caracteres').max(72, 'Maximo 72 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contrasenas no coinciden',
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
  role: z.enum(['admin', 'manager']),
});

export const inviteRegistrationSchema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres').max(100, 'Maximo 100 caracteres'),
  password: z.string().min(8, 'Minimo 8 caracteres').max(72, 'Maximo 72 caracteres'),
  confirmPassword: z.string().min(8, 'Minimo 8 caracteres').max(72, 'Maximo 72 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contrasenas no coinciden',
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  email: z.string().email('Correo electronico invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
  phone: z.string().min(7, 'Telefono invalido'),
});

export const customerFormSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  email: z.string().email('Correo electronico invalido'),
  phone: z.string().min(7, 'Telefono invalido'),
  notes: z.string().optional(),
});

export const customerProfileSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  phone: z.string().min(7, 'Telefono invalido'),
  notes: z.string().optional(),
});

export const customerAddressSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  address: z.string().min(5, 'Direccion invalida'),
  city: z.string().min(2, 'Ciudad invalida'),
  department: z.string().min(2, 'Departamento invalido'),
  phone: z.string().min(7, 'Telefono invalido'),
  isDefault: z.boolean().optional(),
});

export const shippingAddressSchema = z.object({
  address: z.string().min(5, 'Direccion invalida'),
  reference: z.string().optional(),
  city: z.string().min(2, 'Ciudad invalida'),
  department: z.string().optional(),
});

export const checkoutFormSchema = customerFormSchema.merge(shippingAddressSchema);

export const createStoreSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  slug: z.string()
    .min(3, 'Minimo 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo letras, numeros y guiones'),
  description: z.string().optional(),
});

export const editStoreSchema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres').max(100, 'Maximo 100 caracteres'),
  slug: z.string()
    .min(3, 'Minimo 3 caracteres')
    .max(80, 'Maximo 80 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minusculas, numeros y guiones'),
  description: z.string().max(500, 'Maximo 500 caracteres').optional(),
});

export const onboardingProductSchema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres').max(100, 'Maximo 100 caracteres'),
  price: z.coerce.number({ invalid_type_error: 'Ingresa un precio' }).positive('Debe ser mayor a 0'),
  stock: z.coerce.number().int('Debe ser entero').min(0, 'No puede ser negativo').optional(),
  description: z.string().max(500, 'Maximo 500 caracteres').optional(),
});

export const onboardingShippingSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres').max(80, 'Maximo 80 caracteres'),
  type: z.enum(['delivery_zone', 'pickup_point', 'third_party']),
  basePrice: z.coerce.number({ invalid_type_error: 'Ingresa un precio' }).min(0, 'No puede ser negativo'),
});

// Panama mobile numbers: 6xxx-xxxx or 6xxxxxxx
const panamanianPhone = z
  .string()
  .regex(/^6\d{3}-?\d{4}$/, 'Número panameño inválido (ej: 6000-0000)');

export const yappySettingsSchema = z.object({
  yappyPhone: panamanianPhone,
  yappyName: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
});

export const storeSettingsSchema = z.object({
  currency: z.string().min(2, 'Requerido'),
  taxRate: z.coerce
    .number()
    .min(0, 'No puede ser negativo')
    .max(100, 'Maximo 100%'),
  lowStockThreshold: z.coerce
    .number()
    .int('Debe ser entero')
    .min(0, 'No puede ser negativo'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
export type InviteRegistrationFormData = z.infer<typeof inviteRegistrationSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CustomerFormData = z.infer<typeof customerFormSchema>;
export type CustomerProfileFormData = z.infer<typeof customerProfileSchema>;
export type CustomerAddressFormData = z.infer<typeof customerAddressSchema>;
export type ShippingAddressData = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
export type EditStoreFormData = z.infer<typeof editStoreSchema>;
export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
export type OnboardingProductFormData = z.infer<typeof onboardingProductSchema>;
export type OnboardingShippingFormData = z.infer<typeof onboardingShippingSchema>;
export type YappySettingsFormData = z.infer<typeof yappySettingsSchema>;
