import { describe, expect, it } from '@jest/globals';
import {
  checkoutFormSchema,
  createStoreSchema,
  forgotPasswordSchema,
  inviteMemberSchema,
  inviteRegistrationSchema,
  loginSchema,
  resetPasswordSchema,
  yappySettingsSchema,
} from './validators';

describe('validators', () => {
  it('GIVEN invalid login email WHEN validating SHOULD return readable Spanish text', () => {
    const result = loginSchema.safeParse({ email: 'bad-email', password: '123456' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Correo electronico invalido');
    }
  });

  it('GIVEN incomplete checkout data WHEN validating SHOULD avoid corrupted encoding in messages', () => {
    const result = checkoutFormSchema.safeParse({
      name: '',
      email: 'bad-email',
      phone: '',
      address: '',
      city: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain('Minimo 3 caracteres');
      expect(messages).toContain('Telefono invalido');
      expect(messages).toContain('Direccion invalida');
    }
  });

  it('GIVEN invalid store slug WHEN validating SHOULD return readable slug guidance', () => {
    const result = createStoreSchema.safeParse({
      name: 'Mi tienda',
      slug: 'Mi tienda!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Solo letras, numeros y guiones');
    }
  });

  it('GIVEN invalid forgot password email WHEN validating SHOULD return readable text', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-email' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Correo electronico invalido');
    }
  });

  it('GIVEN mismatched reset passwords WHEN validating SHOULD explain the mismatch', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'newsecure123',
      confirmPassword: 'different123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Las contrasenas no coinciden');
    }
  });

  it('GIVEN invalid invite member email WHEN validating SHOULD return readable text', () => {
    const result = inviteMemberSchema.safeParse({
      email: 'bad-email',
      role: 'manager',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Correo electronico invalido');
    }
  });

  it('GIVEN mismatched invite registration passwords WHEN validating SHOULD explain the mismatch', () => {
    const result = inviteRegistrationSchema.safeParse({
      name: 'Ana Perez',
      password: 'newsecure123',
      confirmPassword: 'different123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Las contrasenas no coinciden');
    }
  });

  describe('yappySettingsSchema', () => {
    it('GIVEN valid Panamanian number with dash SHOULD pass', () => {
      const result = yappySettingsSchema.safeParse({ yappyPhone: '6000-0000', yappyName: 'Tienda Panama' });
      expect(result.success).toBe(true);
    });

    it('GIVEN valid Panamanian number without dash SHOULD pass', () => {
      const result = yappySettingsSchema.safeParse({ yappyPhone: '60000000', yappyName: 'Mi Negocio' });
      expect(result.success).toBe(true);
    });

    it('GIVEN number not starting with 6 SHOULD fail', () => {
      const result = yappySettingsSchema.safeParse({ yappyPhone: '5000-0000', yappyName: 'Tienda' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Número panameño inválido (ej: 6000-0000)');
      }
    });

    it('GIVEN US-format number SHOULD fail', () => {
      const result = yappySettingsSchema.safeParse({ yappyPhone: '555-1234-567', yappyName: 'Tienda' });
      expect(result.success).toBe(false);
    });

    it('GIVEN missing yappyName SHOULD fail', () => {
      const result = yappySettingsSchema.safeParse({ yappyPhone: '6000-0000', yappyName: '' });
      expect(result.success).toBe(false);
    });

    it('GIVEN yappyName with 1 char SHOULD fail with min length message', () => {
      const result = yappySettingsSchema.safeParse({ yappyPhone: '6000-0000', yappyName: 'A' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mínimo 2 caracteres');
      }
    });
  });
});
