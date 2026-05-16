import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Input } from './Input';
import { X, Plus } from 'lucide-react-native';
import type { ProductOption } from '@/types';

interface ProductOptionsFieldProps {
  label?: string;
  value: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

export function ProductOptionsField({
  label = 'Opciones / Variantes',
  value,
  onChange,
}: ProductOptionsFieldProps) {
  const [newValueByIndex, setNewValueByIndex] = useState<Record<number, string>>({});

  const options = value ?? [];

  const addOption = () => {
    onChange([...options, { name: '', values: [] }]);
  };

  const removeOption = (index: number) => {
    const next = [...options];
    next.splice(index, 1);
    onChange(next);
  };

  const updateOptionName = (index: number, name: string) => {
    const next = [...options];
    next[index] = { ...next[index], name };
    onChange(next);
  };

  const addValue = (optionIndex: number) => {
    const val = (newValueByIndex[optionIndex] ?? '').trim();
    if (!val) return;
    const next = [...options];
    const currentValues = next[optionIndex].values ?? [];
    if (currentValues.includes(val)) return;
    next[optionIndex] = { ...next[optionIndex], values: [...currentValues, val] };
    onChange(next);
    setNewValueByIndex((prev) => ({ ...prev, [optionIndex]: '' }));
  };

  const removeValue = (optionIndex: number, valueIndex: number) => {
    const next = [...options];
    const values = [...(next[optionIndex].values ?? [])];
    values.splice(valueIndex, 1);
    next[optionIndex] = { ...next[optionIndex], values };
    onChange(next);
  };

  return (
    <View className="mb-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text variant="small" className="font-medium text-foreground">
          {label}
        </Text>
        <TouchableOpacity
          onPress={addOption}
          className="flex-row items-center rounded-md bg-primary px-3 py-1.5"
        >
          <Plus size={14} color="#fff" />
          <Text variant="small" className="ml-1 text-primary-foreground">
            Agregar opción
          </Text>
        </TouchableOpacity>
      </View>

      {options.length === 0 && (
        <Text variant="small" className="text-muted-foreground italic">
          No hay opciones definidas. Agrega una para empezar.
        </Text>
      )}

      {options.map((option, optIndex) => (
        <View
          key={optIndex}
          className="mb-3 rounded-md border border-border bg-background p-3"
        >
          <View className="mb-2 flex-row items-center">
            <View className="flex-1">
              <Input
                label={`Nombre opción #${optIndex + 1}`}
                value={option.name}
                onChangeText={(text) => updateOptionName(optIndex, text)}
                placeholder="ej: Tamaño, Color..."
                className="mb-0"
              />
            </View>
            <TouchableOpacity
              onPress={() => removeOption(optIndex)}
              className="ml-2 mt-5 rounded-full bg-destructive/10 p-2"
            >
              <X size={16} className="text-destructive" />
            </TouchableOpacity>
          </View>

          <Text variant="small" className="mb-1.5 text-muted-foreground">
            Valores
          </Text>

          <View className="mb-2 flex-row flex-wrap gap-2">
            {(option.values ?? []).map((val, valIndex) => (
              <View
                key={valIndex}
                className="flex-row items-center rounded-full bg-secondary px-3 py-1"
              >
                <Text variant="small" className="text-secondary-foreground">
                  {val}
                </Text>
                <TouchableOpacity
                  onPress={() => removeValue(optIndex, valIndex)}
                  className="ml-1.5"
                >
                  <X size={12} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View className="flex-row items-center">
            <View className="flex-1">
              <Input
                value={newValueByIndex[optIndex] ?? ''}
                onChangeText={(text) =>
                  setNewValueByIndex((prev) => ({ ...prev, [optIndex]: text }))
                }
                placeholder="Nuevo valor..."
                onSubmitEditing={() => addValue(optIndex)}
                className="mb-0"
              />
            </View>
            <TouchableOpacity
              onPress={() => addValue(optIndex)}
              className="ml-2 rounded-md bg-primary px-3 py-2.5"
            >
              <Plus size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
