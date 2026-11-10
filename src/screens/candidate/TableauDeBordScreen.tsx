import { ActivityIndicator, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { CandidateStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { getJobs, type JobOffer } from '../../lib/api';
import { useLanguage } from '../../theme/language';

type Category = {
  key: string;
  label: string;
  keyword: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  bg: string;
  color: string;
};

const CATEGORIES: Category[] = [
  { key: 'tech', label: 'Tech', keyword: 'tech', icon: 'terminal', bg: 'bg-primary/10', color: colors.primary },
  { key: 'sante', label: 'Santé', keyword: 'santé', icon: 'medical-services', bg: 'bg-secondary-container/30', color: colors.secondary },
  { key: 'finance', label: 'Finance', keyword: 'finance', icon: 'account-balance', bg: 'bg-tertiary-fixed/30', color: colors.tertiary },
  { key: 'btp', label: 'BTP', keyword: 'btp', icon: 'construction', bg: 'bg-surface-container-highest', color: colors.onSurfaceVariant },
  { key: 'artisanat', label: 'Artisanat', keyword: 'artisanat', icon: 'brush', bg: 'bg-tertiary-fixed/30', color: colors.tertiary },
];




export default function TableauDeBordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CandidateStackParamList>>();
  const { authState } = useAuth();
  const { t, language } = useLanguage();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const greetingName = authState.profile?.full_name?.split(' ')[0] ?? 'Candidat';

  const recommendedJobs = [...jobs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2);
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(2, 6);

  const fetchJobs = async () => {
    try {
      const result = await getJobs();
      setJobs(result);
    } catch (error) {
      console.error('Erreur chargement offres', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
              <Text className="font-sans text-label-md text-on-surface-variant">{t('Bonjour,')}</Text>
                  <Text className="font-sans-bold text-headline-md text-primary">{greetingName}</Text>
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
              placeholder={t('Recherche intelligente (ex: Développeur, Comptable)')}
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
            <Text className="font-sans-semibold text-title-lg text-on-surface">{t('Catégories')}</Text>
            <Pressable onPress={() => navigation.navigate('CandidateTabs', { screen: 'RechercheAvancee', params: { showAll: true } })}>
              <Text className="font-sans-semibold text-label-lg text-primary">Voir tout</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {CATEGORIES.map((cat) => (
              <Pressable key={cat.key} onPress={() => navigation.navigate('CandidateTabs', { screen: 'RechercheAvancee', params: { keyword: cat.keyword } })} className="items-center gap-2">
                <View className={`h-16 w-16 items-center justify-center rounded-lg ${cat.bg}`}>
                  <MaterialIcons name={cat.icon} size={28} color={cat.color} />
                </View>
                <Text className="font-sans text-label-md text-on-surface-variant">{t(cat.label)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Recommended jobs */}
        <View className="mb-lg">
          <View className="mb-md px-container-margin">
            <Text className="font-sans-semibold text-title-lg text-on-surface">{t('Offres recommandées')}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {loadingJobs ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              recommendedJobs.map((job) => (
                <Pressable
                  key={job.id}
                  onPress={() => navigation.navigate('DetailOffre', {
                    jobId: job.id,
                    title: job.title,
                    company: job.company_name ?? 'Entreprise',
                  })}
                  className="w-72 rounded-lg p-md shadow-md bg-surface-container-lowest"
                >
                  <View className="mb-md flex-row items-start justify-between">
                    <View className="h-12 w-12 items-center justify-center rounded-md shadow-sm bg-surface">
                      <MaterialIcons name="business" size={22} color={colors.onSurfaceVariant} />
                    </View>
                    <View className="rounded-full px-3 py-1 bg-secondary-container/20">
                      <Text className="font-sans text-label-md text-on-secondary-container">
                        {job.contract_type ?? 'Contrat'}
                      </Text>
                    </View>
                  </View>
                  <Text className="mb-1 font-sans-semibold text-title-lg text-on-surface">
                    {job.title}
                  </Text>
                  <Text className="mb-md font-sans text-label-lg text-on-surface-variant">
                    {job.company_name ?? 'Entreprise'} • {job.city ?? 'Localisation'}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-sans-bold text-label-lg text-secondary">
                      {job.salary_min ? `${job.salary_min} - ${job.salary_max ?? job.salary_min} CFA` : 'À négocier'}
                    </Text>
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <MaterialIcons name="bookmark-border" size={16} color={colors.primary} />
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

        {/* Verified companies */}
        <View className="mb-lg px-container-margin">
          <View className="flex-row items-center gap-md rounded-lg bg-surface-container-high p-md">
            <View className="flex-1">
              <Text className="mb-1 font-sans-semibold text-label-lg uppercase tracking-wider text-on-surface-variant">
                {t('Entreprises vérifiées')}
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
            <Pressable onPress={() => navigation.navigate('CandidateTabs', { screen: 'RechercheAvancee', params: { verifiedOnly: true, showAll: true } })} className="rounded-md bg-white px-4 py-2 shadow-sm">
              <Text className="font-sans-semibold text-label-lg text-primary">{t('Découvrir')}</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent jobs */}
        <View className="px-container-margin">
          <Text className="mb-md font-sans-semibold text-title-lg text-on-surface">{t('Offres récentes')}</Text>
          <View className="gap-md">
            {recentJobs.map((job) => (
              <Pressable
                key={job.id}
                onPress={() => navigation.navigate('DetailOffre', { jobId: job.id, title: job.title, company: job.company_name })}
                className="flex-row items-center gap-md rounded-lg border border-outline-variant/30 bg-white p-md shadow-sm"
              >
                <View className="h-14 w-14 items-center justify-center rounded-md bg-surface-container-low">
                  <MaterialIcons name="work-outline" size={22} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{job.title}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">
                    {job.company_name ?? 'Entreprise'} • {job.city ?? 'Localisation'}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-sans-bold text-label-md text-secondary">
                    {job.salary_min ? `${job.salary_min} - ${job.salary_max ?? job.salary_min} CFA` : 'À négocier'}
                  </Text>
                  <Text className="text-[10px] font-sans text-outline">
                    {new Date(job.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: 'short' })}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
