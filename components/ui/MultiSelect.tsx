import { useState } from 'react';
import { View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react-native';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  values: string[];
  options: MultiSelectOption[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function MultiSelect({
  label,
  values,
  options,
  onChange,
  placeholder = 'Seleccionar...',
  error,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabels = options
    .filter((o) => values.includes(o.value))
    .map((o) => o.label)
    .join(', ');

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <View className="mb-3">
      {label && (
        <Text variant="small" className="mb-1 font-medium text-foreground">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className={cn(
          'rounded-md border border-border bg-background px-3 py-3',
          error && 'border-destructive'
        )}
      >
        <Text
          variant="body"
          className={cn(!selectedLabels && 'text-muted-foreground')}
        >
          {selectedLabels || placeholder}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text variant="xs" className="mt-1 text-destructive">
          {error}
        </Text>
      )}

      <Modal visible={open} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-2xl bg-background p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text variant="h3">{label || 'Seleccionar'}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <X size={24} className="text-foreground" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const selected = values.includes(item.value);
                return (
                  <TouchableOpacity
                    onPress={() => toggleValue(item.value)}
                    className={cn(
                      'flex-row items-center justify-between rounded-md px-3 py-3',
                      selected && 'bg-primary/10'
                    )}
                  >
                    <Text variant="body">{item.label}</Text>
                    {selected && <Check size={20} className="text-primary" />}
                  </TouchableOpacity>
                );
              }}
            />
            <Button onPress={() => setOpen(false)} className="mt-3">
              Listo
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
