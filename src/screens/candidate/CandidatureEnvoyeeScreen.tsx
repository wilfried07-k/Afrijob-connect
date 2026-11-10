import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CandidatureEnvoyee'>;

export default function CandidatureEnvoyeeScreen({ navigation, route }: Props) {
  const company = route.params?.company ?? 'MTN Cameroon';

  return (
    <Screen>
      <View className="h-16 flex-row items-center px-container-margin">
        <Pressable onPress={() => navigation.navigate('CandidateTabs')} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="ml-md font-sans-semibold text-title-lg text-on-surface">Confirmation</Text>
      </View>

      <View className="flex-1 items-center justify-center px-container-margin">
        <View className="mb-lg h-32 w-32 items-center justify-center rounded-full bg-secondary-container shadow-xl">
          <MaterialIcons name="check" size={56} color={colors.onSecondaryContainer} />
        </View>

        <Text className="mb-md text-center font-sans-bold text-headline-lg text-on-surface">
          Candidature envoyée !
        </Text>
        <Text className="mb-xl max-w-xs text-center font-sans text-body-lg leading-relaxed text-on-surface-variant">
          Votre profil a été transmis avec succès à{' '}
          <Text className="font-sans-bold text-primary">{company}</Text>. Vous recevrez une notification
          dès qu'une action sera entreprise.
        </Text>

        <View className="mb-xl w-full flex-row items-center gap-md rounded-lg border border-outline-variant/30 bg-surface-container p-md">
          <View className="h-14 w-14 items-center justify-center rounded-lg bg-white shadow-sm">
            <MaterialIcons name="business" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-medium text-[11px] uppercase tracking-wider text-on-surface-variant">
              Entreprise
            </Text>
            <Text className="font-sans-semibold text-title-lg text-on-surface">{company}</Text>
            <View className="mt-1 flex-row items-center gap-1">
              <MaterialIcons name="verified" size={16} color={colors.secondary} />
              <Text className="font-sans-semibold text-label-lg text-secondary">Recruteur vérifié</Text>
            </View>
          </View>
        </View>

        <View className="w-full gap-md">
          <Pressable
            className="h-14 flex-row items-center justify-center gap-2 rounded-lg bg-primary shadow-lg"
            onPress={() => navigation.navigate('SuiviCandidatures')}
          >
            <Text className="font-sans-semibold text-label-lg text-on-primary">Voir mes candidatures</Text>
            <MaterialIcons name="description" size={18} color="#ffffff" />
          </Pressable>
          <Pressable
            className="h-14 flex-row items-center justify-center gap-2 rounded-lg bg-primary-fixed"
            onPress={() => navigation.navigate('CandidateTabs')}
          >
            <MaterialIcons name="home" size={18} color={colors.onPrimaryFixed} />
            <Text className="font-sans-semibold text-label-lg text-on-primary-fixed">Retour à l'accueil</Text>
          </Pressable>
        </View>

        <Text className="mt-lg font-sans text-label-md text-on-surface-variant opacity-70">
          Besoin d'aide ? <Text className="font-sans-bold text-primary">Contacter le support</Text>
        </Text>
      </View>
    </Screen>
  );
}
