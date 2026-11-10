import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { getCandidateProfile, listCompanyJobs, listJobApplications, type CandidateProfilePublic, type JobApplicationCandidate } from '../../lib/api';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'ComparaisonCandidats'>;
type CandidateOption = { application: JobApplicationCandidate; profile: CandidateProfilePublic; role: string };

export default function ComparaisonCandidatsScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [candidates, setCandidates] = useState<CandidateOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    if (!companyId) { setCandidates([]); setLoading(false); return; }
    setLoading(true); setLoadError('');
    try {
      const jobs = await listCompanyJobs(companyId);
      const groups = await Promise.all(jobs.map(async (job) => {
        const applications = await listJobApplications(job.id);
        return Promise.all(applications.map(async (application) => ({
          application,
          role: job.title,
          profile: await getCandidateProfile(application.candidate_id),
        })));
      }));
      const unique = new Map<number, CandidateOption>();
      groups.flat().forEach((item) => { if (!unique.has(item.application.candidate_id)) unique.set(item.application.candidate_id, item); });
      const options = Array.from(unique.values());
      setCandidates(options);
      setSelectedIds(options.slice(0, 2).map((item) => item.application.candidate_id));
    } catch (error) { setLoadError((error as Error).message || 'Impossible de charger les profils des candidats.'); }
    finally { setLoading(false); }
  }, [companyId]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const toggle = (candidateId: number) => {
    setSelectedIds((current) => {
      if (current.includes(candidateId)) return current.filter((id) => id !== candidateId);
      if (current.length >= 2) { Alert.alert('Deux candidats maximum', 'Retire un candidat avant d’en choisir un autre.'); return current; }
      return [...current, candidateId];
    });
  };
  const selected = selectedIds.map((id) => candidates.find((item) => item.application.candidate_id === id)).filter((item): item is CandidateOption => Boolean(item));

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-lg-mobile text-primary">Comparer des candidats</Text><View className="w-6" /></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        <Text className="font-sans text-body-md text-on-surface-variant">Choisis jusqu’à deux candidats parmi les candidatures de tes offres. Les données viennent de leurs profils enregistrés.</Text>
        {loading ? <ActivityIndicator color={colors.primary} /> : loadError ? <Text className="font-sans text-body-md text-error">{loadError}</Text> : candidates.length === 0 ? <Text className="font-sans text-body-md text-on-surface-variant">Aucune candidature à comparer.</Text> : <View className="gap-2"><Text className="font-sans-semibold text-title-lg text-on-surface">Candidats disponibles</Text>{candidates.map((candidate) => {
          const id = candidate.application.candidate_id;
          const active = selectedIds.includes(id);
          return <Pressable key={id} onPress={() => toggle(id)} className={'flex-row items-center gap-md rounded-xl border p-md ' + (active ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest')}><View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10"><Text className="font-sans-bold text-label-lg text-primary">{(candidate.profile.full_name || 'C').split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View><View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{candidate.profile.full_name || 'Candidat'}</Text><Text className="font-sans text-label-md text-on-surface-variant">{candidate.role}</Text></View><MaterialIcons name={active ? 'check-circle' : 'radio-button-unchecked'} size={22} color={active ? colors.primary : colors.outlineVariant} /></Pressable>;
        })}</View>}
        {selected.length === 2 && <View className="gap-md">
          <View className="flex-row gap-md">{selected.map((candidate) => <View key={candidate.application.candidate_id} className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><Text className="text-center font-sans-semibold text-label-lg text-on-surface">{candidate.profile.full_name || 'Candidat'}</Text><Text className="text-center font-sans text-label-md text-on-surface-variant">{candidate.role}</Text><Pressable onPress={() => navigation.navigate('DetailsCandidat', { applicationId: candidate.application.application_id, candidateId: candidate.profile.id, name: candidate.profile.full_name, role: candidate.role, matchScore: candidate.application.match_score })}><Text className="font-sans-semibold text-label-md text-primary">Voir le profil</Text></Pressable></View>)}</View>
          <View className="gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md"><Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-outline">Correspondance</Text><View className="flex-row justify-between"><Text className="font-sans text-label-lg text-on-surface-variant">Score offre</Text>{selected.map((item) => <Text key={item.application.candidate_id} className="font-sans-bold text-title-lg text-primary">{Math.round((item.application.match_score ?? 0) <= 1 ? (item.application.match_score ?? 0) * 100 : item.application.match_score ?? 0)}%</Text>)}</View><View className="flex-row justify-between"><Text className="font-sans text-label-lg text-on-surface-variant">Expérience</Text>{selected.map((item) => <Text key={item.application.candidate_id} className="font-sans-semibold text-label-lg text-on-surface">{item.profile.years_experience ?? '—'} ans</Text>)}</View><View className="flex-row justify-between"><Text className="font-sans text-label-lg text-on-surface-variant">Compétences renseignées</Text>{selected.map((item) => <Text key={item.application.candidate_id} className="font-sans-semibold text-label-lg text-on-surface">{item.profile.skills.length}</Text>)}</View><Text className="font-sans text-label-md text-on-surface-variant">Le score mesure la correspondance entre les informations de la candidature et l’offre, pas une évaluation par IA.</Text></View>
        </View>}
      </ScrollView>
    </Screen>
  );
}
