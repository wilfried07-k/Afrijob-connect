import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { listCandidateInterviews, type InterviewSummary } from '../../lib/api';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CalendrierCandidat'>;

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export default function CalendrierCandidatScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const days = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return date;
  }), []);

  const load = useCallback(async () => {
    if (!candidateId) {
      setInterviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    try {
      setInterviews(await listCandidateInterviews(candidateId));
    } catch (error) {
      setLoadError((error as Error).message || 'Impossible de charger les entretiens.');
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const dayInterviews = interviews.filter((interview) => dayKey(new Date(interview.scheduled_at)) === dayKey(selectedDate));

  const openMeeting = async (interview: InterviewSummary) => {
    if (interview.location_or_link && /^https?:\/\//i.test(interview.location_or_link)) {
      try { await Linking.openURL(interview.location_or_link); } catch { Alert.alert('Lien indisponible', 'Impossible d’ouvrir le lien de cet entretien.'); }
      return;
    }
    Alert.alert('Détails de l’entretien', interview.location_or_link || 'Le recruteur n’a pas encore ajouté de lien de visioconférence ou d’adresse.');
  };

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Agenda</Text>
        <View className="w-6" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 12 }}>
        {days.map((date) => {
          const active = dayKey(date) === dayKey(selectedDate);
          return (
            <Pressable key={date.toISOString()} onPress={() => setSelectedDate(date)} className={`min-w-[56px] items-center rounded-xl p-2 ${active ? 'bg-primary shadow-md' : 'bg-surface-container-high'}`}>
              <Text className={`font-sans-medium text-label-md ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>{date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}</Text>
              <Text className={`font-sans-semibold text-title-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>{date.getDate()}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 16 }}>
        <Text className="font-sans-semibold text-headline-md text-on-surface">{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        {loading ? <ActivityIndicator color={colors.primary} /> : loadError ? <Text className="font-sans text-body-md text-error">{loadError}</Text> : dayInterviews.length === 0 ? (
          <Text className="font-sans text-body-md text-on-surface-variant">Aucun entretien prévu pour cette date.</Text>
        ) : dayInterviews.map((interview) => (
          <View key={interview.interview_id} className="flex-row gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="min-w-[64px] items-center border-r border-outline-variant/30 pr-md">
              <Text className="font-sans-semibold text-title-lg text-primary">{new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-sans-semibold text-title-lg text-on-surface">{interview.job_title ?? 'Entretien'}</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">{interview.company_name ?? 'Entreprise'} · {interview.mode === 'onsite' ? 'Sur site' : 'Visioconférence'}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">Statut : {interview.status}</Text>
              <Pressable onPress={() => void openMeeting(interview)} className="mt-2 h-10 flex-row items-center justify-center gap-1 rounded-lg border border-primary">
                <MaterialIcons name={interview.mode === 'onsite' ? 'location-on' : 'videocam'} size={16} color={colors.primary} />
                <Text className="font-sans-semibold text-label-lg text-primary">Voir les détails</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
