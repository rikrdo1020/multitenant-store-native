import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { login } from '@/services/auth';

export function useLoginScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const safeReturnPath = useMemo(() => getSafeReturnPath(returnTo), [returnTo]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const user = await login(data.email, data.password);

      if (returnTo) {
        router.replace(safeReturnPath as never);
      } else if (user.role === 'customer') {
        router.replace('/marketplace');
      } else if (user.role === 'superadmin') {
        router.replace('/(superadmin)/dashboard');
      } else if (!user.onboardingCompleted) {
        router.replace('/(auth)/welcome');
      } else {
        router.replace('/(admin)/dashboard');
      }
    } catch {
      form.setError('root', { message: 'Credenciales incorrectas. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    focusedField,
    goToForgotPassword: () => router.push('/(auth)/forgot-password'),
    goToRegister: () => router.push('/(auth)/register'),
    loading,
    setFocusedField,
    setShowPassword,
    showPassword,
    submit: form.handleSubmit(onSubmit),
  };
}

function getSafeReturnPath(returnTo?: string): string {
  if (!returnTo) return '/';

  try {
    const decoded = decodeURIComponent(returnTo);
    if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('://')) {
      return '/';
    }

    return decoded;
  } catch {
    return '/';
  }
}
