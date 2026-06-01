import { useState } from 'react';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { register } from '@/services/auth';

export function useRegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      console.log('[register] payload:', JSON.stringify({ ...data, password: '***' }));
      const user = await register(data);
      console.log('[register] success:', JSON.stringify(user));
      router.replace('/(auth)/welcome');
    } catch (err: unknown) {
      const e = err as Record<string, unknown>;
      console.error('[register] error:', JSON.stringify(e?.response ?? e?.message ?? err));
      form.setError('root', { message: 'No fue posible crear la cuenta. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    focusedField,
    goBack: () => router.back(),
    goToLogin: () => router.push('/(auth)/login'),
    loading,
    setFocusedField,
    setShowPassword,
    showPassword,
    submit: form.handleSubmit(onSubmit),
  };
}
