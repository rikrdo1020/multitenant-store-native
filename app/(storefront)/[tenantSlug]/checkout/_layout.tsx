import type { ComponentProps, ReactNode } from 'react';
import { Stack } from 'expo-router';

type StackWithIdProps = Omit<ComponentProps<typeof Stack>, 'id'> & {
  id?: string;
  children?: ReactNode;
};

const StackWithId = Stack as unknown as (props: StackWithIdProps) => JSX.Element;

export default function CheckoutLayout() {
  return (
    <StackWithId id="checkout" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Envío' }} />
      <Stack.Screen name="payment" options={{ title: 'Pago' }} />
      <Stack.Screen name="confirmation" options={{ title: 'Confirmación', gestureEnabled: false }} />
    </StackWithId>
  );
}
