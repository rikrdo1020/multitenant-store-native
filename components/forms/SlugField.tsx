import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import { CheckCircle, RefreshCw, XCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils';
import { tenantService } from '@/services/tenant';

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

interface SlugFieldProps {
  value: string;
  onChangeText: (v: string) => void;
  nameValue?: string;
  excludeDocumentId?: string;
  error?: string;
}

export function SlugField({ value, onChangeText, nameValue, excludeDocumentId, error }: SlugFieldProps) {
  const [status, setStatus] = useState<SlugStatus>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isValidSlug = (s: string) => /^[a-z0-9-]{3,}$/.test(s);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value) {
      setStatus('idle');
      return;
    }

    if (!isValidSlug(value)) {
      setStatus('invalid');
      return;
    }

    setStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const { available } = await tenantService.checkSlug(value, excludeDocumentId);
        setStatus(available ? 'available' : 'taken');
      } catch {
        setStatus('idle');
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, excludeDocumentId]);

  const generateFromName = () => {
    if (!nameValue) return;
    const generated = slugify(nameValue).slice(0, 40);
    onChangeText(generated);
  };

  const borderColor =
    status === 'available' ? 'border-green-500' :
    status === 'taken' ? 'border-destructive' :
    error ? 'border-destructive' :
    'border-border';

  return (
    <View className="mb-3">
      <View className="mb-1 flex-row items-center justify-between">
        <Text variant="small" className="font-medium text-foreground">
          Slug / dominio
        </Text>
        {nameValue ? (
          <TouchableOpacity onPress={generateFromName} className="flex-row items-center gap-1">
            <RefreshCw size={11} className="text-primary" />
            <Text variant="xs" className="text-primary">Generar desde nombre</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View className={cn('flex-row items-center rounded-md border bg-background px-3', borderColor)}>
        <TextInput
          className="flex-1 py-3 text-base text-foreground"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={(v) => onChangeText(v.toLowerCase().replace(/\s/g, '-'))}
          placeholder="mi-tienda"
        />
        <View className="ml-2">
          {status === 'checking' && <ActivityIndicator size="small" />}
          {status === 'available' && <CheckCircle size={18} color="#22c55e" />}
          {status === 'taken' && <XCircle size={18} color="#ef4444" />}
        </View>
      </View>

      {status === 'available' && (
        <Text variant="xs" className="mt-1 text-green-600">Disponible</Text>
      )}
      {status === 'taken' && (
        <Text variant="xs" className="mt-1 text-destructive">Slug no disponible, elige otro</Text>
      )}
      {status === 'invalid' && value.length > 0 && (
        <Text variant="xs" className="mt-1 text-destructive">
          Solo letras minúsculas, números y guiones (mín. 3)
        </Text>
      )}
      {status === 'idle' && error && (
        <Text variant="xs" className="mt-1 text-destructive">{error}</Text>
      )}

      <Text variant="xs" className="mt-1 text-muted-foreground">
        URL: /tienda/{value || '...'}
      </Text>
    </View>
  );
}
