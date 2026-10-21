import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { listCompanyInterviews, updateInterviewStatus, type InterviewSummary } from '../../lib/api';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'GestionEntretiensVideo'>;
type Filter = 'upcoming' | 'done' | 'cancelled';
const FILTERS: { label: string; value: Filter }[] = [
  { label: 'À venir', value: 'upcoming' },
  { label: 'Terminés', value: 'done' },
  { label: 'Annulés', value: 'cancelled' },
];

function statusGroup(status: string): Filter {
  const value = status.toLowerCase();
  if (value.includes('annul') || value.includes('cancel')) return 'cancelled';
  if (value.includes('termin') || value.includes('complet')) return 'done';
  return 'upcoming';
}

export default function GestionEntretiensVideoScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    if (!companyId) { setInterviews([]); setLoading(false); return; }
    setLoading(true);
    setLoadError('');
    try { setInterviews(await listCompanyInterviews(companyId)); }
    catch (error) { setLoadError((error as Error).message || 'Impossible de charger les entretiens.'); }
    finally { setLoading(false); }
  }, [companyId]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const updateStatus = async (interview: InterviewSummary, status: string) => {
    try {
      await updateInterviewStatus(interview.interview_id, status);
      await load();
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de mettre à jour cet entretien.'); }
  };
  const items = interviews.filter((interview) => statusGroup(interview.status) === filter);

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Entretiens</Text><View className="w-6" />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.interview_id)}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={<View className="mb-md gap-md">
          <View className="flex-row items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"><MaterialIcons name="info-outline" size={20} color={colors.primary} /><Text className="flex-1 font-sans text-label-md text-on-surface-variant">Ajoutez un lien de visioconférence ou une adresse lors de la planification. La création automatique de salles vidéo nécessite un service dédié.</Text></View>
          <View className="flex-row gap-2">{FILTERS.map((item) => <Pressable key={item.value} onPress={() => setFilter(item.value)} className={`rounded-full px-md py-2 ${filter === item.value ? 'bg-primary-container' : 'bg-surface-container-high'}`}><Text className={`font-sans-medium text-label-md ${filter === item.value ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{item.label}</Text></Pressable>)}</View>
        </View>}
        renderItem={({ item }) => <View className="gap-md rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="flex-row items-center gap-md"><View className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-container"><Text className="font-sans-bold text-label-lg text-on-surface-variant">{(item.candidate_name || 'C').split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View><View className="flex-1"><Text className="font-sans-semibold text-title-lg text-on-surface">{item.candidate_name || 'Candidat'}</Text><Text className="font-sans text-body-md text-on-surface-variant">{item.job_title || 'Entretien'}</Text><Text className="mt-1 font-sans text-label-md text-on-surface-variant">{new Date(item.scheduled_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</Text></View></View>
          <Text className="font-sans text-label-md text-on-surface-variant">{item.mode === 'onsite' ? 'Sur site' : 'Visioconférence'} · {item.status}</Text>
          {item.location_or_link ? <Text className="font-sans text-label-md text-primary">{item.location_or_link}</Text> : null}
          {item.report_status ? <Pressable onPress={() => navigation.navigate('ValidationRapportRH', { interviewId: item.interview_id, candidateName: item.candidate_name, role: item.job_title })} className="h-10 items-center justify-center rounded-lg border border-secondary"><Text className="font-sans-semibold text-label-lg text-secondary">Consulter le rapport · {item.report_status}</Text></Pressable> : null}
          {statusGroup(item.status) === 'upcoming' && <View className="flex-row gap-2"><Pressable onPress={() => navigation.navigate('NotesEntretien', { interviewId: item.interview_id, candidateName: item.candidate_name, role: item.job_title })} className="h-10 flex-1 items-center justify-center rounded-lg border border-primary"><Text className="font-sans-semibold text-label-lg text-primary">Préparer mes notes</Text></Pressable><Pressable onPress={() => Alert.alert('Terminer cet entretien ?', '', [{ text: 'Annuler', style: 'cancel' }, { text: 'Terminer', onPress: () => void updateStatus(item, 'Terminée') }])} className="h-10 items-center justify-center rounded-lg bg-surface-container-high px-md"><Text className="font-sans-semibold text-label-lg text-on-surface">Terminer</Text></Pressable></View>}
        </View>}
        ListEmptyComponent={loading ? <ActivityIndicator color={colors.primary} /> : <View className="items-center gap-md py-xl"><MaterialIcons name="event-busy" size={48} color={colors.outline} /><Text className={`font-sans text-body-md ${loadError ? 'text-error' : 'text-on-surface-variant'}`}>{loadError || 'Aucun entretien dans cette liste.'}</Text></View>}
      />
    </Screen>
  );
}
