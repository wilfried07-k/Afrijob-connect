import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const FUNNEL = [
  { label: 'Vues', value: 4820, color: colors.primary },
  { label: 'Candidatures', value: 342, color: colors.secondary },
  { label: 'Présélectionnés', value: 84, color: colors.tertiary },
  { label: 'Entretiens', value: 28, color: colors.onSurfaceVariant },
  { label: 'Embauchés', value: 6, color: colors.error },
];
const MAX_FUNNEL = FUNNEL[0].value;

const TOP_JOBS = [
  { title: 'Développeur Fullstack Senior', views: 1240, applications: 84 },
  { title: 'Comptable Agréé', views: 890, applications: 52 },
];

export default function AnalytiqueRecruteurScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Analytique</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        {/* Funnel */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Entonnoir de recrutement</Text>
          <View className="gap-md">
            {FUNNEL.map((step) => (
              <View key={step.label} className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-medium text-label-lg text-on-surface-variant">{step.label}</Text>
                  <Text className="font-sans-bold text-label-lg text-on-surface">{step.value}</Text>
                </View>
                <View className="h-3 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${(step.value / MAX_FUNNEL) * 100}%`, backgroundColor: step.color }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Conversion rate */}
        <View className="flex-row gap-md">
          <View className="flex-1 gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <MaterialIcons name="touch-app" size={20} color={colors.primary} />
            <Text className="font-sans text-label-md text-on-surface-variant">Taux de clic</Text>
            <Text className="font-sans-bold text-headline-md text-primary">7.1%</Text>
          </View>
          <View className="flex-1 gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <MaterialIcons name="bolt" size={20} color={colors.secondary} />
            <Text className="font-sans text-label-md text-on-surface-variant">Taux de conversion</Text>
            <Text className="font-sans-bold text-headline-md text-secondary">1.75%</Text>
          </View>
        </View>

        {/* Top jobs */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Offres les plus performantes</Text>
          <View className="gap-2">
            {TOP_JOBS.map((job) => (
              <View key={job.title} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{job.title}</Text>
                <View className="flex-row gap-lg">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="visibility" size={16} color={colors.onSurfaceVariant} />
                    <Text className="font-sans text-label-md text-on-surface-variant">{job.views} vues</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="description" size={16} color={colors.onSurfaceVariant} />
                    <Text className="font-sans text-label-md text-on-surface-variant">{job.applications} candidatures</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
