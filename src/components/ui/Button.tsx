import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export default function Button({ label, onPress, variant = 'primary', disabled }: Props) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-[48px] w-full items-center justify-center rounded-md px-lg ${
        isPrimary ? 'bg-primary-container' : 'bg-primary-fixed'
      } ${disabled ? 'opacity-50' : ''}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : disabled ? 0.5 : 1 })}
    >
      <Text
        className={`font-sans-semibold text-base ${
          isPrimary ? 'text-on-primary-container' : 'text-on-primary-fixed'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
