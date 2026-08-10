import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
  route?: { params?: { campaignName?: string } };
};

export default function ConfirmationEnvoiCampagneScreen({ navigation, route }: Props) {
  const campaignName = route?.params?.campaignName ?? 'Votre campagne';

  return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className="h-28 w-28 items-center justify-center rounded-full bg-secondary-container shadow-xl">
        <MaterialIcons name="campaign" size={52} color={colors.onSecondaryContainer} />
      </View>
      <View className="items-center gap-2">
        <Text className="font-sans-bold text-headline-lg text-on-surface">Campagne envoyée !</Text>
        <Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant">
          <Text className="font-sans-bold text-on-surface">{campaignName}</Text> a été diffusée avec
          succès à votre audience ciblée.
        </Text>
      </View>
      <Pressable
        onPress={() => navigation.navigate('SuiviPerformancesCampagne', { campaignName })}
        className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
      >
        <MaterialIcons name="bar-chart" size={18} color="#ffffff" />
        <Text className="font-sans-semibold text-title-lg text-on-primary">Suivre les performances</Text>
      </Pressable>
      <Pressable onPress={() => navigation.goBack()}>
        <Text className="font-sans-semibold text-label-lg text-primary">Retour</Text>
      </Pressable>
    </View>
  );
}
