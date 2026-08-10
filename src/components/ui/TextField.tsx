import { useState } from 'react';
import { TextInput, View, Text, TextInputProps, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = TextInputProps & {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isPassword?: boolean;
  rightAdornment?: React.ReactNode;
};

export default function TextField({ label, icon, isPassword, rightAdornment, ...inputProps }: Props) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(!!isPassword);

  return (
    <View className="gap-xs">
      <Text className="px-1 font-sans-semibold text-label-lg text-on-surface-variant">{label}</Text>
      <View
        className={`h-14 flex-row items-center rounded-md bg-surface-container-low px-md ${
          focused ? 'border-2 border-primary' : 'border border-transparent'
        }`}
      >
        <MaterialIcons name={icon} size={20} color={focused ? colors.primary : colors.outline} />
        <TextInput
          {...inputProps}
          secureTextEntry={secure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.outline}
          className="ml-md flex-1 font-sans text-body-md text-on-surface"
        />
        {isPassword && (
          <Pressable onPress={() => setSecure((s) => !s)} hitSlop={8}>
            <MaterialIcons
              name={secure ? 'visibility' : 'visibility-off'}
              size={20}
              color={colors.outline}
            />
          </Pressable>
        )}
        {rightAdornment}
      </View>
    </View>
  );
}
