import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'ConfirmationEntretien'>;

const DETAILS: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }[] = [
  { icon: 'work', label: 'Poste', value: 'Product Designer' },
  { icon: 'calendar-today', label: 'Date', value: 'Lundi 14 Octobre' },
  { icon: 'schedule', label: 'Heure', value: '10:30 — 11:30' },
  { icon: 'videocam', label: 'Format', value: 'Visioconférence' },
];

const TIPS = [
  { icon: 'description' as const, title: 'Révisez la description du poste', body: 'Assurez-vous de bien comprendre les attentes du rôle.' },
  { icon: 'person' as const, title: 'Recherchez vos interlocuteurs', body: "Consultez le profil de l'équipe qui vous recevra." },
  { icon: 'checklist' as const, title: 'Préparez vos questions', body: "Ayez 2 à 3 questions pertinentes sur l'entreprise et le poste." },
];

export default function ConfirmationEntretienScreen({ navigation, route }: Props) {
  const company = route.params?.company ?? 'MTN Cameroon';

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.navigate('SuiviCandidatures')} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Confirmation d'entretien</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        {/* Success */}
        <View className="items-center gap-2 pt-md">
          <View className="mb-2 h-20 w-20 items-center justify-center rounded-full bg-secondary-container shadow-md">
            <MaterialIcons name="check-circle" size={40} color={colors.onSecondaryContainer} />
          </View>
          <Text className="font-sans-bold text-headline-lg-mobile text-primary">Félicitations !</Text>
          <Text className="font-sans text-body-lg text-on-surface-variant">
            Votre entretien est confirmé.
          </Text>
        </View>

        {/* Summary card */}
        <View className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg">
          <View className="flex-row items-center gap-md border-b border-outline-variant bg-primary-container/5 p-lg">
            <View className="h-12 w-12 items-center justify-center rounded-lg border border-outline-variant bg-white shadow-sm">
              <MaterialIcons name="business" size={20} color={colors.onSurfaceVariant} />
            </View>
            <View>
              <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-primary">
                Entretien confirmé
              </Text>
              <Text className="font-sans-semibold text-headline-md text-on-surface">{company}</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-y-lg p-lg">
            {DETAILS.map((detail) => (
              <View key={detail.label} className="w-1/2 flex-row items-start gap-2 pr-2">
                <MaterialIcons name={detail.icon} size={18} color={colors.primary} />
                <View>
                  <Text className="font-sans text-label-md text-on-surface-variant">{detail.label}</Text>
                  <Text className="font-sans-semibold text-body-lg text-on-surface">{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable className="mx-lg mb-lg flex-row items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-container-low p-md">
            <View className="flex-row items-center gap-3">
              <View className="rounded-full bg-white p-2 shadow-sm">
                <MaterialIcons name="video-call" size={20} color={colors.primary} />
              </View>
              <View>
                <Text className="font-sans-semibold text-body-md text-on-surface">Lien Google Meet inclus</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">meet.google.com/abc-defg-hij</Text>
              </View>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={colors.onSurfaceVariant} />
          </Pressable>
        </View>

        {/* CTAs */}
        <View className="gap-2">
          <Pressable className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-md">
            <MaterialIcons name="event" size={20} color="#ffffff" />
            <Text className="font-sans-semibold text-label-lg text-on-primary">Ajouter au calendrier</Text>
          </Pressable>
          <Pressable className="h-12 items-center justify-center rounded-xl">
            <Text className="font-sans-semibold text-label-lg text-primary">Modifier le créneau</Text>
          </Pressable>
        </View>

        {/* Info notice */}
        <View className="flex-row items-start gap-3 rounded-lg border border-secondary/20 bg-secondary-container/10 px-md py-3">
          <MaterialIcons name="mail" size={20} color={colors.secondary} />
          <Text className="flex-1 font-sans text-body-md leading-tight text-on-surface-variant">
            Le lien de réunion vous a également été envoyé par email. Vérifiez votre boîte de réception.
          </Text>
        </View>

        {/* Tips */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="lightbulb" size={20} color={colors.tertiary} />
            <Text className="font-sans-semibold text-title-lg text-on-surface">Conseils de préparation</Text>
          </View>
          <View className="gap-md">
            {TIPS.map((tip) => (
              <View
                key={tip.title}
                className="flex-row items-start gap-md rounded-lg border border-outline-variant bg-surface-container p-md"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <MaterialIcons name={tip.icon} size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-sans-semibold text-body-lg text-on-surface">{tip.title}</Text>
                  <Text className="font-sans text-body-md text-on-surface-variant">{tip.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
