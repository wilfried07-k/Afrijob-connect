import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { CandidateStackParamList } from '../../navigation/types';
import { listFavorites, removeFavorite, type FavoriteJob } from '../../lib/api';
import { useAuth } from '../../lib/auth';

export default function FavorisScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CandidateStackParamList>>();
  const { authState } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Toutes');
  const [savedJobs, setSavedJobs] = useState<FavoriteJob[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unsavingJobId, setUnsavingJobId] = useState<number | null>(null);

  const filters = ['Toutes', ...Array.from(new Set((savedJobs ?? []).map((job) => job.city).filter((city): city is string => Boolean(city))))];
  const visibleJobs = (savedJobs ?? []).filter((job) => activeFilter === 'Toutes' || job.city === activeFilter).sort((a, b) => new Date(b.saved_at ?? 0).getTime() - new Date(a.saved_at ?? 0).getTime());
  const handleUnsave = async (jobOfferId: number) => {
    const candidateId = authState.profile?.candidate_profile_id;
    if (!candidateId) return;
    setUnsavingJobId(jobOfferId);
    try {
      await removeFavorite(candidateId, jobOfferId);
      setSavedJobs((current) => current?.filter((job) => job.job_offer_id !== jobOfferId) ?? []);
    } catch (err) {
      console.error('Erreur suppression favori', err);
    } finally {
      setUnsavingJobId(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const candidateId = authState.profile?.candidate_profile_id;
        if (candidateId) {
          const res = await listFavorites(candidateId);
          setSavedJobs(res);
        } else {
          setSavedJobs([]);
        }
      } catch (err) {
        console.error('Erreur récupération favoris', err);
        setLoadError((err as Error).message || 'Impossible de charger les favoris.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authState.profile]);

  return (
    <Screen>
      {/* Header */}
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Favoris</Text>
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-primary-fixed bg-surface-container-low">
          <Text className="font-sans-bold text-label-md text-primary">SN</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={visibleJobs}
          keyExtractor={(item) => String(item.job_offer_id)}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListHeaderComponent={
            <View className="mb-md gap-md">
              <View className="flex-row gap-2">
                {filters.map((filter) => {
                  const active = filter === activeFilter;
                  return (
                    <Pressable
                      key={filter}
                      onPress={() => setActiveFilter(filter)}
                      className={`rounded-full px-lg py-2 ${active ? 'bg-primary-container' : 'bg-surface-container-high'}`}
                    >
                      <Text className={`font-sans-semibold text-label-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                        {filter}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="font-sans text-body-md text-on-surface-variant">
                  {savedJobs?.length ?? 0} offres enregistrées
                </Text>
                <Text className="font-sans text-label-md text-on-surface-variant">Tri par date</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('DetailOffre', { jobId: item.job_offer_id, title: item.title, company: item.company_name })}
              className="flex-row gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className="h-14 w-14 items-center justify-center rounded-md bg-surface-container">
                <MaterialIcons name="business" size={22} color={colors.onSurfaceVariant} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-2">
                    <Text className="font-sans-semibold text-headline-md text-on-surface">{item.title}</Text>
                    <Text className="mt-1 font-sans text-label-lg text-on-surface-variant">
                      {item.company_name} • {item.city ?? ''}
                    </Text>
                  </View>
                  <Pressable onPress={() => handleUnsave(item.job_offer_id)} hitSlop={8}>
                    <MaterialIcons name="bookmark" size={22} color={unsavingJobId === item.job_offer_id ? colors.onSurfaceVariant : colors.primary} />
                  </Pressable>
                </View>
                <View className="mt-md flex-row items-center justify-between">
                  <View className="rounded-full bg-secondary-container/20 px-md py-1">
                    <Text className="font-sans-semibold text-label-md text-on-secondary-container">
                      {item.salary_min ? `${item.salary_min} - ${item.salary_max ?? item.salary_min} CFA` : 'À négocier'}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="schedule" size={16} color={colors.onSurfaceVariant} />
                    <Text className="font-sans text-label-md text-on-surface-variant">{new Date(item.saved_at ?? '').toLocaleDateString('fr-FR')}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="items-center gap-md py-xl">
              <MaterialIcons name="bookmark-border" size={48} color={colors.outline} />
              <Text className="font-sans text-body-md text-on-surface-variant">{loadError ?? (activeFilter === 'Toutes' ? 'Aucune offre enregistrée' : 'Aucun favori dans cette ville')}</Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}
