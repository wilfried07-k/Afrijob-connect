import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { RecruiterStackParamList } from '../../navigation/types';

type Metric = {
  key: string;
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendIcon?: keyof typeof MaterialIcons.glyphMap;
  trendColor?: string;
};

const METRICS: Metric[] = [
  {
    key: 'active',
    label: 'Offres Actives',
    value: '12',
    icon: 'business-center',
    iconBg: 'bg-primary/10',
    iconColor: colors.primary,
    trend: '+2 cette semaine',
    trendIcon: 'trending-up',
    trendColor: colors.secondary,
  },
  {
    key: 'applications',
    label: 'Candidatures',
    value: '45',
    icon: 'person-add',
    iconBg: 'bg-secondary-container/20',
    iconColor: colors.secondary,
    trend: '8 non consultées',
    trendIcon: 'groups',
    trendColor: colors.secondary,
  },
  {
    key: 'interviews',
    label: 'Entretiens',
    value: '08',
    icon: 'calendar-today',
    iconBg: 'bg-tertiary-fixed/30',
    iconColor: colors.tertiary,
    trend: 'Prochains 3 jours',
  },
];

type RecentJob = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  postedOn: string;
  location: string;
  candidates: number;
  status: 'Actif' | 'Urgent';
};

const RECENT_JOBS: RecentJob[] = [
  { key: '1', title: 'Développeur Fullstack Senior', icon: 'code', postedOn: 'Publié le 12 Oct', location: 'Douala (Bonapriso)', candidates: 24, status: 'Actif' },
  { key: '2', title: 'Comptable Agréé', icon: 'account-balance', postedOn: 'Publié le 08 Oct', location: 'Yaoundé', candidates: 18, status: 'Actif' },
  { key: '3', title: 'Social Media Manager', icon: 'campaign', postedOn: 'Publié le 05 Oct', location: 'Remote', candidates: 56, status: 'Urgent' },
];

export default function TableauDeBordRecruteurScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 24 }}>
        {/* Header */}
        <View className="gap-1">
          <Text className="font-sans-bold text-headline-lg text-on-surface">
            Bonjour, Global Talent Corp 👋
          </Text>
          <Text className="font-sans text-body-md text-on-surface-variant">
            Voici l'état actuel de vos recrutements pour aujourd'hui.
          </Text>
        </View>

        <View className="flex-row gap-md">
          <Pressable className="flex-row items-center justify-center gap-2 self-start rounded-full bg-primary px-lg py-3 shadow-md" onPress={() => navigation.navigate('PublierOffre')}>
            <MaterialIcons name="add" size={18} color="#ffffff" />
            <Text className="font-sans-semibold text-label-lg text-on-primary">Publier une offre</Text>
          </Pressable>
          <Pressable
            className="flex-row items-center justify-center gap-2 self-start rounded-full border border-primary px-lg py-3"
            onPress={() => navigation.navigate('GestionEntretiensVideo')}
          >
            <MaterialIcons name="videocam" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Entretiens vidéo</Text>
          </Pressable>
        </View>

        {/* Metrics */}
        <View className="gap-md">
          {METRICS.map((metric) => (
            <View
              key={metric.key}
              className="justify-between gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg"
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-on-surface-variant">
                  {metric.label}
                </Text>
                <View className={`h-10 w-10 items-center justify-center rounded-full ${metric.iconBg}`}>
                  <MaterialIcons name={metric.icon} size={20} color={metric.iconColor} />
                </View>
              </View>
              <View className="flex-row items-baseline gap-2">
                <Text className="font-sans-bold text-display-lg text-on-surface">{metric.value}</Text>
                {metric.trend && (
                  <View className="flex-row items-center gap-1">
                    {metric.trendIcon && (
                      <MaterialIcons name={metric.trendIcon} size={14} color={metric.trendColor ?? colors.onSurfaceVariant} />
                    )}
                    <Text
                      className="font-sans-semibold text-xs"
                      style={{ color: metric.trendColor ?? colors.onSurfaceVariant }}
                    >
                      {metric.trend}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Quick access: analytics, IA, pricing */}
        <View className="flex-row gap-md">
          <Pressable
            onPress={() => navigation.navigate('AnalytiqueRecruteur')}
            className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <MaterialIcons name="insights" size={22} color={colors.primary} />
            <Text className="text-center font-sans-semibold text-label-md text-on-surface">Analytique</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('RecommandationsIARecruteur')}
            className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <MaterialIcons name="psychology-alt" size={22} color={colors.primary} />
            <Text className="text-center font-sans-semibold text-label-md text-on-surface">Recos IA</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('TarifsEntreprises')}
            className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <MaterialIcons name="workspace-premium" size={22} color={colors.primary} />
            <Text className="text-center font-sans-semibold text-label-md text-on-surface">Tarifs</Text>
          </Pressable>
        </View>

        {/* Quick access: templates, export */}
        <View className="flex-row gap-md">
          <Pressable
            onPress={() => navigation.navigate('BibliothequeModeles')}
            className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <MaterialIcons name="file-copy" size={22} color={colors.primary} />
            <Text className="text-center font-sans-semibold text-label-md text-on-surface">Modèles</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ExportationRapport')}
            className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <MaterialIcons name="ios-share" size={22} color={colors.primary} />
            <Text className="text-center font-sans-semibold text-label-md text-on-surface">Exporter</Text>
          </Pressable>
        </View>

        {/* Recent jobs */}
        <View className="gap-md">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-headline-md text-on-surface">Mes Offres Récentes</Text>
            <Text className="font-sans-semibold text-label-lg text-primary">Voir tout</Text>
          </View>
          <View className="gap-md">
            {RECENT_JOBS.map((job) => (
              <Pressable
                key={job.key}
                className="flex-row items-center gap-md rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-md"
              >
                <View className="h-12 w-12 items-center justify-center rounded-md bg-surface-container-high">
                  <MaterialIcons name={job.icon} size={22} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-title-lg text-on-surface" numberOfLines={1}>
                    {job.title}
                  </Text>
                  <View className="mt-1 flex-row flex-wrap gap-md">
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="schedule" size={14} color={colors.onSurfaceVariant} />
                      <Text className="text-xs font-sans text-on-surface-variant">{job.postedOn}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="location-on" size={14} color={colors.onSurfaceVariant} />
                      <Text className="text-xs font-sans text-on-surface-variant">{job.location}</Text>
                    </View>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <Text className="font-sans-bold text-headline-md text-on-surface">{job.candidates}</Text>
                  <View
                    className={`rounded-full px-2 py-0.5 ${job.status === 'Urgent' ? 'bg-error/10' : 'bg-secondary/10'}`}
                  >
                    <Text
                      className="text-[10px] font-sans-bold"
                      style={{ color: job.status === 'Urgent' ? colors.error : colors.secondary }}
                    >
                      {job.status}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
