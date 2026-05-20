import { LoginScreen } from '@/components/auth/LoginScreen';
import { useLoginRouteGuard } from '@/hooks/use-login-route-guard';

export default function LoginRoute() {
  const shouldRender = useLoginRouteGuard();

  if (!shouldRender) return null;

  return <LoginScreen />;
}
