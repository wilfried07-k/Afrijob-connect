import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

export default function ValidationPaiementUSSDScreen({ navigation }: Props) {
  const [seconds, setSeconds] = useState(90);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      navigation.navigate('PaiementReussi');
    }
  }, [seconds, navigation]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');

  return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-primary-container/20">
        <MaterialIcons name="dialpad" size={44} color={colors.primary} />
      </View>
      <View className="items-center gap-2">
        <Text className="font-sans-bold text-headline-lg text-on-surface">Confirmez sur votre téléphone</Text>
        <Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant">
          Composez <Text className="font-sans-bold text-primary">*126#</Text> et validez le paiement de{' '}
          <Text className="font-sans-bold text-on-surface">45 000 FCFA</Text> avec votre code secret.
        </Text>
      </View>

      <View className="items-center gap-1 rounded-2xl bg-surface-container-low px-xl py-lg">
        <Text className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
          En attente de confirmation
        </Text>
        <Text className="font-sans-bold text-display-lg text-primary">{mm}:{ss}</Text>
      </View>

      <Pressable className="flex-row items-center gap-2" onPress={() => navigation.goBack()}>
        <MaterialIcons name="close" size={18} color={colors.error} />
        <Text className="font-sans-semibold text-label-lg text-error">Annuler le paiement</Text>
      </Pressable>
    </View>
  );
}
