import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { RecruiterStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { listCompanyJobs, listJobApplications, updateApplicationStatus, type JobApplicationCandidate } from '../../lib/api';

type Candidate = JobApplicationCandidate & { role: string };
type Column = { key: string; title: string; status: string; candidates: Candidate[] };
const COLUMNS = [
  { key: 'new', title: 'Nouvelles', status: 'Envoyée' },
  { key: 'review', title: 'En examen', status: 'En examen' },
  { key: 'interview', title: 'Entretien', status: 'Entretien' },
  { key: 'accepted', title: 'Acceptées', status: 'Acceptée' },
  { key: 'rejected', title: 'Refusées', status: 'Refusée' },
];
const NEXT_STATUS: Record<string, string> = { Envoyée: 'En examen', 'En examen': 'Entretien', Entretien: 'Acceptée' };

function ScoreBadge({ score }: { score?: number }) {
  if (score === undefined || score === null) return null;
  const percent = Math.round(score <= 1 ? score * 100 : score);
  const high = percent >= 85;
  return <View className={`flex-row items-center gap-1 rounded-md px-2 py-1 ${high ? 'bg-secondary-container/30' : 'bg-surface-container-highest'}`}><MaterialIcons name="bolt" size={14} color={high ? colors.onSecondaryContainer : colors.onSurfaceVariant} /><Text className={`font-sans-bold text-xs ${high ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}>{percent}%</Text></View>;
}

export default function GestionDesCandidatsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [applications, setApplications] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!companyId) { setApplications([]); setLoading(false); return; }
    setLoading(true); setLoadError('');
    try {
      const jobs = await listCompanyJobs(companyId);
      const grouped = await Promise.all(jobs.map(async (job) => (await listJobApplications(job.id)).map((item) => ({ ...item, role: job.title }))));
      setApplications(grouped.flat());
    } catch (error) { setLoadError((error as Error).message || 'Impossible de charger les candidatures.'); }
    finally { setLoading(false); }
  }, [companyId]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const changeStatus = async (application: Candidate, status: string) => {
    setUpdatingId(application.application_id);
    try {
      await updateApplicationStatus(application.application_id, status);
      setApplications((current) => current.map((item) => item.application_id === application.application_id ? { ...item, status } : item));
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de modifier le statut.'); }
    finally { setUpdatingId(null); }
  };

  const columns: Column[] = COLUMNS.map((column) => ({ ...column, candidates: applications.filter((item) => item.status.toLowerCase() === column.status.toLowerCase()) }));
  return (
    <Screen>
      <View className="flex-row items-center justify-between gap-md px-container-margin pb-md pt-md">
        <View className="flex-1 gap-1"><Text className="font-sans-bold text-headline-lg text-on-surface">Candidats</Text><Text className="font-sans text-body-md text-on-surface-variant">Suivez les candidatures reçues sur vos offres.</Text></View>
        <Pressable onPress={() => navigation.navigate('ComparaisonCandidats')} className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-high"><MaterialIcons name="compare-arrows" size={20} color={colors.primary} /></Pressable>
      </View>
      {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : loadError ? <Text className="px-container-margin py-xl font-sans text-body-md text-error">{loadError}</Text> : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
          {columns.map((column) => <View key={column.key} className="w-72 gap-md">
            <View className="flex-row items-center justify-between px-1"><View className="flex-row items-center gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface">{column.title}</Text><View className="rounded-full bg-surface-container-highest px-2 py-0.5"><Text className="text-xs font-sans-bold text-on-surface">{column.candidates.length}</Text></View></View></View>
            <View className="gap-md">{column.candidates.map((candidate) => <View key={candidate.application_id} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
              <Pressable onPress={() => navigation.navigate('DetailsCandidat', { applicationId: candidate.application_id, candidateId: candidate.candidate_id, name: candidate.full_name, role: candidate.role, matchScore: candidate.match_score })}>
                <View className="mb-md flex-row items-start justify-between"><View className="flex-row items-center gap-md"><View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Text className="font-sans-bold text-label-lg text-primary">{(candidate.full_name || 'C').split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View><View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{candidate.full_name || 'Candidat'}</Text><Text className="text-xs font-sans text-on-surface-variant">{candidate.role}</Text></View></View><ScoreBadge score={candidate.match_score} /></View>
              </Pressable>
              <View className="flex-row items-center justify-between border-t border-outline-variant/30 pt-md"><Pressable onPress={() => navigation.navigate('PlanifierEntretien', { applicationId: candidate.application_id, candidateName: candidate.full_name, role: candidate.role })} className="flex-row items-center gap-1 rounded-full bg-primary/10 px-md py-2"><MaterialIcons name="event" size={16} color={colors.primary} /><Text className="font-sans-semibold text-xs text-primary">Entretien</Text></Pressable>{NEXT_STATUS[candidate.status] && <Pressable disabled={updatingId === candidate.application_id} onPress={() => void changeStatus(candidate, NEXT_STATUS[candidate.status])} className="flex-row items-center gap-1 rounded-full bg-primary-container/10 px-md py-2"><Text className="font-sans-semibold text-xs text-primary">{updatingId === candidate.application_id ? '...' : 'Avancer'}</Text><MaterialIcons name="chevron-right" size={16} color={colors.primary} /></Pressable>}{candidate.status.toLowerCase() === 'acceptée' && <Pressable onPress={() => navigation.navigate('DeclarationEmbauche', { candidateId: candidate.candidate_id, candidateName: candidate.full_name, role: candidate.role })} className="flex-row items-center gap-1 rounded-full bg-secondary-container/30 px-md py-2"><MaterialIcons name="fact-check" size={14} color={colors.secondary} /><Text className="font-sans-semibold text-xs text-secondary">DIPE</Text></Pressable>}</View>
            </View>)}{column.candidates.length === 0 && <View className="items-center rounded-lg border border-dashed border-outline-variant py-lg"><Text className="font-sans text-label-md text-on-surface-variant">Aucun candidat</Text></View>}</View>
          </View>)}
        </ScrollView>
      )}
    </Screen>
  );
}
