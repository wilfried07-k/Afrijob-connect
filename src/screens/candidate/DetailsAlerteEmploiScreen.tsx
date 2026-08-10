import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void };
  route?: { params?: { title?: string; location?: string } };
};

const MATCHING_JOBS = [
  { id: '1', title: 'Product Designer Senior', company: 'MTN Cameroon', timeAgo: 'Il y a 2h' },
  { id: '2', title: 'UI/UX Designer', company: 'Kmer Digital', timeAgo: 'Il y a 1j' },
];

export default function DetailsAlerteEmploiScreen({ navigation, route }: Props) {
  const title = route?.params?.title ?? 'Product Designer';
  const location = route?.params?.location ?? 'Douala';

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Détails de l'alerte</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-headline-md text-on-surface">{title}</Text>
            <Switch value trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="location-on" size={16} color={colors.onSurfaceVariant} />
            <Text className="font-sans text-body-md text-on-surface-variant">{location}</Text>
          </View>
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Critères de l'alerte</Text>
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Fréquence</Text>
              <Text className="font-sans-semibold text-label-lg text-on-surface">Instantané</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Créée le</Text>
              <Text className="font-sans-semibold text-label-lg text-on-surface">10 Juin 2026</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Offres trouvées</Text>
              <Text className="font-sans-semibold text-label-lg text-primary">14 au total</Text>
            </View>
          </View>
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Dernières offres correspondantes</Text>
          <View className="gap-2">
            {MATCHING_JOBS.map((job) => (
              <View key={job.id} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="h-11 w-11 items-center justify-center rounded-lg bg-surface-container-high">
                  <MaterialIcons name="work-outline" size={20} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{job.title}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">{job.company}</Text>
                </View>
                <Text className="font-sans text-[11px] text-outline">{job.timeAgo}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-error/30">
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
          <Text className="font-sans-semibold text-label-lg text-error">Supprimer cette alerte</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
