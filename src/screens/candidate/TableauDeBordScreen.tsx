import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { CandidateStackParamList } from '../../navigation/types';

type Category = {
  key: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  bg: string;
  color: string;
};

const CATEGORIES: Category[] = [
  { key: 'tech', label: 'Tech', icon: 'terminal', bg: 'bg-primary/10', color: colors.primary },
  { key: 'sante', label: 'Santé', icon: 'medical-services', bg: 'bg-secondary-container/30', color: colors.secondary },
  { key: 'finance', label: 'Finance', icon: 'account-balance', bg: 'bg-tertiary-fixed/30', color: colors.tertiary },
  { key: 'btp', label: 'BTP', icon: 'construction', bg: 'bg-surface-container-highest', color: colors.onSurfaceVariant },
  { key: 'artisanat', label: 'Artisanat', icon: 'brush', bg: 'bg-tertiary-fixed/30', color: colors.tertiary },
];

type JobCard = {
  key: string;
  title: string;
  company: string;
  location: string;
  contract: string;
  salary: string;
  highlighted?: boolean;
};

const RECOMMENDED_JOBS: JobCard[] = [
  {
    key: '1',
    title: 'Product Designer Senior',
    company: 'MTN Cameroon',
    location: 'Akwa',
    contract: 'Full-time',
    salary: '450k - 600k CFA / mois',
  },
  {
    key: '2',
    title: 'Backend Developer',
    company: 'Campost',
    location: 'Bastos',
    contract: 'Hybride',
    salary: '500k - 750k CFA / mois',
    highlighted: true,
  },
];

type RecentJob = {
  key: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAgo: string;
};

const RECENT_JOBS: RecentJob[] = [
  { key: '1', title: 'Ingénieur Génie Civil', company: 'BTP Global', location: 'Yaoundé', salary: '300k CFA', postedAgo: 'Il y a 2h' },
  { key: '2', title: 'Responsable Marketing', company: 'Hilton', location: 'Yaoundé', salary: 'À négocier', postedAgo: 'Il y a 5h' },
  { key: '3', title: 'Professeur d\u2019Anglais', company: 'Excel Academy', location: 'Douala', salary: '250k CFA', postedAgo: 'Il y a 1j' },
];

export default function TableauDeBordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CandidateStackParamList>>();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-container-margin pb-md pt-sm">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-surface-container-low">
              <Text className="font-sans-bold text-label-lg text-primary">SN</Text>
            </View>
            <View>
              <Text className="font-sans text-label-md text-on-surface-variant">Bonjour,</Text>
              <Text className="font-sans-bold text-headline-md text-primary">Samuel N.</Text>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-container"
          >
            <MaterialIcons name="notifications" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Search */}
        <View className="px-container-margin pb-lg">
          <View className="mb-md flex-row items-center gap-2">
            <MaterialIcons name="location-on" size={16} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Douala, Cameroun</Text>
            <MaterialIcons name="expand-more" size={16} color={colors.primary} />
          </View>
          <View className="flex-row items-center rounded-lg bg-surface-container-low px-md">
            <MaterialIcons name="search" size={20} color={colors.outline} />
            <TextInput
              placeholder="Recherche intelligente (ex: Développeur, Comptable)"
              placeholderTextColor={colors.outline}
              className="ml-2 flex-1 py-4 font-sans text-body-md text-on-surface"
            />
            <Pressable className="h-10 w-10 items-center justify-center rounded-md bg-primary">
              <MaterialIcons name="tune" size={18} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <View className="mb-lg">
          <View className="mb-md flex-row items-center justify-between px-container-margin">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Catégories</Text>
            <Text className="font-sans-semibold text-label-lg text-primary">Voir tout</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {CATEGORIES.map((cat) => (
              <View key={cat.key} className="items-center gap-2">
                <View className={`h-16 w-16 items-center justify-center rounded-lg ${cat.bg}`}>
                  <MaterialIcons name={cat.icon} size={28} color={cat.color} />
                </View>
                <Text className="font-sans text-label-md text-on-surface-variant">{cat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recommended jobs */}
        <View className="mb-lg">
          <View className="mb-md px-container-margin">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Offres recommandées</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {RECOMMENDED_JOBS.map((job) => (
              <Pressable
                key={job.key}
                onPress={() => navigation.navigate('DetailOffre', { title: job.title, company: job.company })}
                className={`w-72 rounded-lg p-md shadow-md ${
                  job.highlighted ? 'bg-primary' : 'border border-outline-variant/30 bg-surface-container-lowest'
                }`}
              >
                <View className="mb-md flex-row items-start justify-between">
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-md shadow-sm ${
                      job.highlighted ? 'bg-white' : 'bg-surface'
                    }`}
                  >
                    <MaterialIcons name="business" size={22} color={job.highlighted ? colors.primary : colors.onSurfaceVariant} />
                  </View>
                  <View className={`rounded-full px-3 py-1 ${job.highlighted ? 'bg-white/20' : 'bg-secondary-container/20'}`}>
                    <Text className={`font-sans text-label-md ${job.highlighted ? 'text-white' : 'text-on-secondary-container'}`}>
                      {job.contract}
                    </Text>
                  </View>
                </View>
                <Text className={`mb-1 font-sans-semibold text-title-lg ${job.highlighted ? 'text-white' : 'text-on-surface'}`}>
                  {job.title}
                </Text>
                <Text className={`mb-md font-sans text-label-lg ${job.highlighted ? 'text-white/80' : 'text-on-surface-variant'}`}>
                  {job.company} • {job.location}
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className={`font-sans-bold text-label-lg ${job.highlighted ? 'text-white' : 'text-secondary'}`}>
                    {job.salary}
                  </Text>
                  <Pressable
                    className={`h-8 w-8 items-center justify-center rounded-full ${
                      job.highlighted ? 'bg-white/20' : 'bg-primary/10'
                    }`}
                  >
                    <MaterialIcons name="bookmark-border" size={16} color={job.highlighted ? '#ffffff' : colors.primary} />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Verified companies */}
        <View className="mb-lg px-container-margin">
          <View className="flex-row items-center gap-md rounded-lg bg-surface-container-high p-md">
            <View className="flex-1">
              <Text className="mb-1 font-sans-semibold text-label-lg uppercase tracking-wider text-on-surface-variant">
                Entreprises vérifiées
              </Text>
              <View className="flex-row">
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className="-ml-2 h-10 w-10 items-center justify-center rounded-full border-2 border-surface-container-high bg-white first:ml-0"
                  >
                    <MaterialIcons name="apartment" size={16} color={colors.onSurfaceVariant} />
                  </View>
                ))}
                <View className="-ml-2 h-10 w-10 items-center justify-center rounded-full border-2 border-surface-container-high bg-primary">
                  <Text className="font-sans-bold text-[10px] text-white">+40</Text>
                </View>
              </View>
            </View>
            <Pressable className="rounded-md bg-white px-4 py-2 shadow-sm">
              <Text className="font-sans-semibold text-label-lg text-primary">Découvrir</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent jobs */}
        <View className="px-container-margin">
          <Text className="mb-md font-sans-semibold text-title-lg text-on-surface">Offres récentes</Text>
          <View className="gap-md">
            {RECENT_JOBS.map((job) => (
              <Pressable
                key={job.key}
                onPress={() => navigation.navigate('DetailOffre', { title: job.title, company: job.company })}
                className="flex-row items-center gap-md rounded-lg border border-outline-variant/30 bg-white p-md shadow-sm"
              >
                <View className="h-14 w-14 items-center justify-center rounded-md bg-surface-container-low">
                  <MaterialIcons name="work-outline" size={22} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{job.title}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">
                    {job.company} • {job.location}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-sans-bold text-label-md text-secondary">{job.salary}</Text>
                  <Text className="text-[10px] font-sans text-outline">{job.postedAgo}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
