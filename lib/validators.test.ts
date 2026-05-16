import { describe, expect, it } from '@jest/globals';
import {
  checkoutFormSchema,
  createStoreSchema,
  loginSchema,
} from './validators';

describe('validators', () => {
  it('GIVEN invalid login email WHEN validating SHOULD return readable Spanish text', () => {
    const result = loginSchema.safeParse({ email: 'bad-email', password: '123456' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email invalido');
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
});
