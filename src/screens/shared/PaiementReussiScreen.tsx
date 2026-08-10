import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

export default function PaiementReussiScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className="h-28 w-28 items-center justify-center rounded-full bg-secondary-container shadow-xl">
        <MaterialIcons name="check" size={56} color={colors.onSecondaryContainer} />
      </View>
      <View className="items-center gap-2">
        <Text className="font-sans-bold text-headline-lg text-on-surface">Paiement réussi !</Text>
        <Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant">
          Votre abonnement Premium est maintenant actif. Un reçu a été envoyé par email.
        </Text>
      </View>

      <View className="w-full gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
        <View className="flex-row justify-between">
          <Text className="font-sans text-label-md text-on-surface-variant">Référence</Text>
          <Text className="font-sans-semibold text-label-md text-on-surface">TRX-9821-OM</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-sans text-label-md text-on-surface-variant">Montant</Text>
          <Text className="font-sans-semibold text-label-md text-on-surface">45 000 FCFA</Text>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate('RecruiterTabs')}
        className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
      >
        <Text className="font-sans-semibold text-title-lg text-on-primary">Retour à l'accueil</Text>
      </Pressable>
    </View>
  );
}
