import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface AdminOrdersStateProps {
  message: string;
  title?: string;
  error?: boolean;
  loading?: boolean;
  onRetry?: () => void;
}

export function AdminOrdersState({
  message,
  title,
  error,
  loading,
  onRetry,
}: AdminOrdersStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      {loading ? <ActivityIndicator size="large" className="text-primary" /> : null}
      {title ? (
        <Text
          variant="h2"
          className={`mb-2 text-center ${error ? "text-destructive" : ""}`}
        >
          {title}
        </Text>
      ) : null}
      <Text variant="body" className="mt-4 text-center text-muted-foreground">
        {message}
      </Text>
      {onRetry ? (
        <Button onPress={onRetry} className="mt-6">
          Reintentar
        </Button>
      ) : null}
    </View>
  );
}
