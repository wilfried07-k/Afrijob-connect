import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AdminStackParamList } from '../../navigation/types';
import { listOpenAdminJobs, type JobOffer } from '../../lib/api';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'OffresOuvertes'>;

export default function OffresOuvertesScreen({ navigation }: Props) {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setJobs(await listOpenAdminJobs()); setError(''); }
    catch (err) { setError((err as Error).message || 'Impossible de charger les offres ouvertes.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Offres ouvertes</Text></View>
      {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : <ScrollView contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 32 }}>
        {error ? <View className="gap-2"><Text className="font-sans text-body-md text-error">{error}</Text><Pressable onPress={() => void load()}><Text className="font-sans-semibold text-label-lg text-primary">Réessayer</Text></Pressable></View> : null}
        <Text className="font-sans text-label-md text-on-surface-variant">{jobs.length} offre{jobs.length === 1 ? '' : 's'} actuellement ouvertes</Text>
        {jobs.map((job) => <Pressable key={job.id} onPress={() => Alert.alert(job.title, `${job.company_name ?? 'Entreprise'} · ${job.city ?? 'Ville non renseignée'}\n\n${job.description}`)} className="flex-row items-start gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md"><View className="h-11 w-11 items-center justify-center rounded-lg bg-secondary/10"><MaterialIcons name="work-outline" size={21} color={colors.secondary} /></View><View className="flex-1"><Text className="font-sans-semibold text-title-lg text-on-surface">{job.title}</Text><Text className="font-sans text-label-md text-on-surface-variant">{job.company_name ?? 'Entreprise'} · {job.city ?? 'Cameroun'}</Text><Text className="mt-1 font-sans text-body-md text-on-surface-variant" numberOfLines={3}>{job.description}</Text></View><MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} /></Pressable>)}
        {!error && !jobs.length ? <Text className="py-xl text-center font-sans text-body-md text-on-surface-variant">Aucune offre ouverte.</Text> : null}
      </ScrollView>}
    </Screen>
  );
}