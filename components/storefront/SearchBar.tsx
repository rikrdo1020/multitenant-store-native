import { View, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar productos...' }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-secondary rounded-xl px-3 gap-2 h-11">
      <Search size={16} color="#737373" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#737373"
        className="flex-1 text-foreground text-sm py-0"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <X size={16} color="#737373" />
        </Pressable>
      )}
    </View>
  );
}
