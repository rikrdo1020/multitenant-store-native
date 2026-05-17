import { useLocalSearchParams } from 'expo-router';
import { ResetPasswordScreen } from '@/components/auth/ResetPasswordScreen';

function getTokenParam(token: string | string[] | undefined): string {
  if (Array.isArray(token)) return token[0] ?? '';
  return token ?? '';
}

export default function ResetPasswordRoute() {
  const params = useLocalSearchParams<{ token?: string | string[] }>();

  return <ResetPasswordScreen token={getTokenParam(params.token)} />;
}
