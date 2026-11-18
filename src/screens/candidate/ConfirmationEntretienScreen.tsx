import { Alert, Linking, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'ConfirmationEntretien'>;

const TIPS = [
  { icon: 'description' as const, title: 'Révisez la description du poste', body: 'Assurez-vous de bien comprendre les attentes du rôle.' },
  { icon: 'person' as const, title: 'Recherchez vos interlocuteurs', body: "Consultez le profil de l'équipe qui vous recevra." },
  { icon: 'checklist' as const, title: 'Préparez vos questions', body: "Ayez 2 à 3 questions pertinentes sur l'entreprise et le poste." },
];

export default function ConfirmationEntretienScreen({ navigation, route }: Props) {
  const company = route.params?.company ?? 'Entreprise';
  const position = route.params?.position ?? 'Poste';
  const scheduledAt = route.params?.scheduledAt ? new Date(route.params.scheduledAt) : null;
  const mode = route.params?.mode ?? 'video';
  const locationOrLink = route.params?.locationOrLink;

  const formattedDate = scheduledAt
    ? scheduledAt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    : '—';
  const formattedTime = scheduledAt
    ? scheduledAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '—';

  const isVideoLink = locationOrLink && /^https?:\/\//i.test(locationOrLink);

  const openMeeting = async () => {
    if (!locationOrLink) return;
    if (isVideoLink) {
      try {
        await Linking.openURL(locationOrLink);
      } catch {
        Alert.alert('Lien indisponible', "Impossible d'ouvrir ce lien.");
      }
    } else {
      Alert.alert('Adresse', locationOrLink);
    }
  };

  const DETAILS: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }[] = [
    { icon: 'work', label: 'Poste', value: position },
    { icon: 'calendar-today', label: 'Date', value: formattedDate },
    { icon: 'schedule', label: 'Heure', value: formattedTime },
    { icon: mode === 'onsite' ? 'location-on' : 'videocam', label: 'Format', value: mode === 'onsite' ? 'Sur site' : 'Visioconférence' },
  ];

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.navigate('SuiviCandidatures')} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Confirmation d'entretien</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        {/* Success banner */}
        <View className="items-center gap-2 pt-md">
          <View className="mb-2 h-20 w-20 items-center justify-center rounded-full bg-secondary-container shadow-md">
            <MaterialIcons name="check-circle" size={40} color={colors.onSecondaryContainer} />
          </View>
          <Text className="font-sans-bold text-headline-lg-mobile text-primary">Félicitations !</Text>
          <Text className="font-sans text-body-lg text-on-surface-variant text-center">
            Votre entretien est confirmé avec {company}.
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

          {/* Link or address */}
          {locationOrLink ? (
            <Pressable onPress={() => void openMeeting()} className="mx-lg mb-lg flex-row items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-container-low p-md">
              <View className="flex-row items-center gap-3">
                <View className="rounded-full bg-white p-2 shadow-sm">
                  <MaterialIcons name={isVideoLink ? 'video-call' : 'location-on'} size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-body-md text-on-surface">
                    {isVideoLink ? 'Lien de visioconférence' : 'Adresse du rendez-vous'}
                  </Text>
                  <Text numberOfLines={1} className="font-sans text-label-md text-on-surface-variant">{locationOrLink}</Text>
                </View>
              </View>
              <MaterialIcons name="open-in-new" size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          ) : (
            <View className="mx-lg mb-lg flex-row items-start gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-low p-md">
              <MaterialIcons name="info-outline" size={18} color={colors.onSurfaceVariant} />
              <Text className="flex-1 font-sans text-label-md text-on-surface-variant">
                Le recruteur n'a pas encore ajouté de lien de visioconférence ou d'adresse. Consultez votre agenda pour les mises à jour.
              </Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <View className="gap-2">
          <Pressable
            onPress={() => navigation.navigate('CalendrierCandidat')}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-md"
          >
            <MaterialIcons name="event" size={20} color="#ffffff" />
            <Text className="font-sans-semibold text-label-lg text-on-primary">Voir mon agenda</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('SuiviCandidatures')}
            className="h-12 items-center justify-center rounded-xl"
          >
            <Text className="font-sans-semibold text-label-lg text-primary">Retour à mes candidatures</Text>
          </Pressable>
        </View>

        {/* Info notice */}
        <View className="flex-row items-start gap-3 rounded-lg border border-secondary/20 bg-secondary-container/10 px-md py-3">
          <MaterialIcons name="mail" size={20} color={colors.secondary} />
          <Text className="flex-1 font-sans text-body-md leading-tight text-on-surface-variant">
            Les détails de votre entretien ont également été enregistrés dans votre agenda. Vérifiez régulièrement en cas de modification.
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
