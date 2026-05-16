import { useLocalSearchParams } from 'expo-router';
import { InviteRegistrationScreen } from '@/components/auth/InviteRegistrationScreen';

function getTokenParam(token: string | string[] | undefined): string {
  if (Array.isArray(token)) return token[0] ?? '';
  return token ?? '';
}

export default function InviteRoute() {
  const params = useLocalSearchParams<{ token?: string | string[] }>();

  return <InviteRegistrationScreen token={getTokenParam(params.token)} />;
}
