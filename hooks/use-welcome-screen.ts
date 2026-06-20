import { useState } from 'react';
import { useRouter } from 'expo-router';
import { completeOnboarding } from '@/services/auth';

export function useWelcomeScreen() {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);

  const goToChecklist = async () => {
    await markComplete();
    router.replace('/(owner)/create-store');
  };

  const goToDashboard = async () => {
    await markComplete();
    router.replace('/(admin)/dashboard');
  };

  async function markComplete() {
    if (completing) return;
    try {
      setCompleting(true);
      await completeOnboarding();
    } catch {
      // Non-blocking — user can still navigate
    } finally {
      setCompleting(false);
    }
  }

  return { completing, goToChecklist, goToDashboard };
}
