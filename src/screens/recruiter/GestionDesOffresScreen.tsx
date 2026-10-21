import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { listCompanyJobs, type JobOffer } from '../../lib/api';
import { RecruiterStackParamList } from '../../navigation/types';

type Status = 'Ouvert' | 'Brouillon' | 'Fermé';

const FILTERS: { label: string; value: Status | 'Tout' }[] = [
  { label: 'Tout', value: 'Tout' },
  { label: 'Ouvert', value: 'Ouvert' },
  { label: 'Brouillon', value: 'Brouillon' },
  { label: 'Fermé', value: 'Fermé' },
];

const STATUS_STYLE: Record<Status, { bg: string; text: string }> = {
  Ouvert: { bg: 'bg-secondary/10', text: 'text-secondary' },
  Brouillon: { bg: 'bg-tertiary/10', text: 'text-tertiary' },
  Fermé: { bg: 'bg-error/10', text: 'text-error' },
};

export default function GestionDesOffresScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [filter, setFilter] = useState<Status | 'Tout'>('Tout');
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredJobs = filter === 'Tout' ? jobs : jobs.filter((job) => job.status === filter);

  const filterWithCounts = FILTERS.map((item) => ({
    ...item,
    count: item.value === 'Tout' ? jobs.length : jobs.filter((job) => job.status === item.value).length,
  }));

  const fetchJobs = async () => {
    if (!companyId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await listCompanyJobs(companyId);
      setJobs(result);
    } catch (error) {
      console.error('Erreur chargement offres', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [companyId]);

  return (
    <Screen>
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-lg">
            <View className="flex-row items-center justify-between gap-md">
              <View className="flex-1">
                <Text className="font-sans-bold text-headline-lg text-on-surface">Gestion des Offres</Text>
                <Text className="font-sans text-body-md text-on-surface-variant">
                  Suivez et gérez vos recrutements en temps réel.
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('PublierOffre')}
              className="flex-row items-center justify-center gap-2 self-start rounded-full bg-primary px-lg py-3 shadow-md"
            >
              <MaterialIcons name="add" size={18} color="#ffffff" />
              <Text className="font-sans-semibold text-label-lg text-on-primary">Créer une offre</Text>
            </Pressable>
            <View className="flex-row flex-wrap gap-2">
              {filterWithCounts.map((f) => {
                const active = f.value === filter;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilter(f.value)}
                    className={`rounded-full border px-lg py-2 ${
                      active ? 'border-primary/20 bg-primary-container' : 'border-outline-variant bg-surface-container-lowest'
                    }`}
                  >
                    <Text className={`font-sans-semibold text-label-lg ${active ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {f.label} ({f.count})
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View className="items-center justify-center py-20">
              <Text className="font-sans text-label-lg text-on-surface-variant">Aucune offre trouvée.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
            <Pressable
              onPress={() => navigation.navigate('AnalytiqueOffre', { title: item.title })}
              className="flex-row items-center gap-md"
            >
              <View className="h-14 w-14 items-center justify-center rounded-lg bg-surface-container-highest">
                <MaterialIcons name="work" size={28} color={colors.primary} />
              </View>
              <View className="flex-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="font-sans-semibold text-headline-md text-on-surface">{item.title}</Text>
                  <View className={`rounded px-2 py-0.5 ${STATUS_STYLE[item.status as Status]?.bg ?? 'bg-outline-variant'}`}>
                    <Text className={`text-[10px] font-sans-bold uppercase tracking-wider ${STATUS_STYLE[item.status as Status]?.text ?? 'text-on-surface-variant'}`}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View className="mt-1 flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={14} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-body-md text-on-surface-variant">{item.city ?? 'Localisation'}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="font-sans-bold text-headline-md text-on-surface">
                  {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </Text>
                <Text className="text-[10px] font-sans-bold uppercase tracking-tighter text-on-surface-variant">
                  Publié
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('SponsoringOffres')}
              className="mt-md flex-row items-center justify-center gap-1 rounded-lg border border-primary/30 py-2"
            >
              <MaterialIcons name="rocket-launch" size={14} color={colors.primary} />
              <Text className="font-sans-semibold text-label-md text-primary">Sponsoriser cette offre</Text>
            </Pressable>
          </View>
        )}
      />
    </Screen>
  );
}
