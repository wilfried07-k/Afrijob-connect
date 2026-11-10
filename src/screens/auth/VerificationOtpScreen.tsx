import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerificationOtp'>;

const CODE_LENGTH = 6;
const RESEND_DELAY = 59;

export default function VerificationOtpScreen({ navigation, route }: Props) {
  const contact = route.params?.phone ?? route.params?.email ?? '+237 6xx xxx xxx';
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (value: string, index: number) => {
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const code = digits.join('');
  const timerLabel = `00:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <Screen>
      {/* Header */}
      <View className="h-16 flex-row items-center px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.onSurfaceVariant} />
        </Pressable>
        <Text className="flex-1 pr-12 text-center font-sans-bold text-headline-lg-mobile text-on-surface">
          Vérification
        </Text>
      </View>

      <View className="flex-1 items-center px-container-margin pt-lg">
        {/* Icon */}
        <View className="mb-lg h-24 w-24 items-center justify-center rounded-xl bg-primary-container/10">
          <MaterialIcons name="shield" size={48} color={colors.primary} />
        </View>

        {/* Guidance text */}
        <Text className="mb-2 font-sans-semibold text-headline-md text-on-surface">
          Code de vérification
        </Text>
        <Text className="mb-lg max-w-[280px] text-center font-sans text-body-md text-on-surface-variant">
          Entrez le code à 6 chiffres envoyé au{' '}
          <Text className="font-sans-semibold text-on-surface">{contact}</Text>
        </Text>

        {/* OTP boxes */}
        <View className="mb-lg w-full flex-row justify-center gap-2">
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              maxLength={1}
              keyboardType="number-pad"
              className="h-16 w-12 rounded-md border border-outline-variant bg-surface-container-lowest text-center font-sans-bold text-headline-md text-on-surface"
            />
          ))}
        </View>

        {/* Timer / resend */}
        <View className="mb-lg items-center gap-2">
          {secondsLeft > 0 ? (
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
              Renvoyer le code (<Text className="text-primary">{timerLabel}</Text>)
            </Text>
          ) : (
            <Pressable onPress={() => setSecondsLeft(RESEND_DELAY)}>
              <Text className="font-sans-semibold text-label-lg text-primary">Renvoyer le code</Text>
            </Pressable>
          )}
        </View>

        <View className="w-full">
          <Button
            label="Vérifier"
            disabled={code.length !== CODE_LENGTH}
            onPress={() => navigation.navigate('ChoixTypeCompte')}
          />
        </View>
      </View>
    </Screen>
  );
}
