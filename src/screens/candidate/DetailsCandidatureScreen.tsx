import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { listCandidateApplications, listCandidateInterviews, startConversation, withdrawApplication, type ApplicationDetail, type InterviewSummary } from '../../lib/api';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'DetailsCandidature'>;

export default function DetailsCandidatureScreen({ navigation, route }: Props) {
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const applicationId = route.params?.applicationId;
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [interview, setInterview] = useState<InterviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!candidateId || !applicationId) {
        setLoadError('Candidature introuvable.');
        setLoading(false);
        return;
      }
      setLoading(true); setLoadError('');
      try {
        const [applications, interviews] = await Promise.all([
          listCandidateApplications(candidateId),
          listCandidateInterviews(candidateId),
        ]);
        if (!active) return;
        const found = applications.find((item) => item.id === applicationId) ?? null;
        setApplication(found);
        setInterview(interviews.find((item) => item.application_id === applicationId) ?? null);
        if (!found) setLoadError('Cette candidature n’existe plus ou n’est pas accessible.');
      } catch (error) { if (active) setLoadError((error as Error).message || 'Impossible de charger la candidature.'); }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [candidateId, applicationId]);

  const title = application?.job_title ?? route.params?.title ?? 'Candidature';
  const company = application?.company_name ?? route.params?.company ?? 'Entreprise';

  const contactRecruiter = async () => {
    if (!candidateId || !application?.company_id) { Alert.alert('Messagerie indisponible', 'Cette candidature ne contient pas d’entreprise associée.'); return; }
    setContacting(true);
    try {
      const conversation = await startConversation(candidateId, application.company_id);
      navigation.navigate('DiscussionCandidat', { conversationId: conversation.id, company });
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible d’ouvrir la conversation.'); }
    finally { setContacting(false); }
  };

  const withdraw = () => {
    if (!application) return;
    Alert.alert('Retirer cette candidature ?', 'Le recruteur ne la verra plus dans son pipeline.', [
      { text: 'Garder ma candidature', style: 'cancel' },
      { text: 'Retirer', style: 'destructive', onPress: async () => {
        try { await withdrawApplication(application.id); Alert.alert('Candidature retirée', 'Ta candidature a été supprimée.', [{ text: 'OK', onPress: navigation.goBack }]); }
        catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de retirer cette candidature.'); }
      } },
    ]);
  };

  const openInterviewLocation = async () => {
    if (!interview?.location_or_link) return;
    if (/^https?:\/\//i.test(interview.location_or_link)) await Linking.openURL(interview.location_or_link);
    else Alert.alert('Adresse de l’entretien', interview.location_or_link);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Ma candidature</Text></View>
      {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : loadError ? <Text className="px-container-margin py-xl font-sans text-body-md text-error">{loadError}</Text> : application ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm"><View className="flex-row items-center gap-md"><View className="h-14 w-14 items-center justify-center rounded-lg bg-primary/10"><MaterialIcons name="business" size={24} color={colors.primary} /></View><View className="flex-1"><Text className="font-sans-semibold text-title-lg text-on-surface">{title}</Text><Text className="font-sans text-body-md text-on-surface-variant">{company}</Text></View></View><View className="self-start rounded-full bg-primary-container/20 px-3 py-1"><Text className="font-sans-semibold text-label-md text-primary">{application.status}</Text></View><Text className="font-sans text-label-md text-on-surface-variant">Envoyée le {new Date(application.created_at).toLocaleDateString('fr-FR')}</Text></View>
          <View className="gap-md"><Text className="font-sans-semibold text-title-lg text-on-surface">Suivi</Text><View className="flex-row items-start gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><View className="h-8 w-8 items-center justify-center rounded-full bg-secondary"><MaterialIcons name="check" size={18} color="#fff" /></View><View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">Candidature envoyée</Text><Text className="font-sans text-label-md text-on-surface-variant">{new Date(application.created_at).toLocaleString('fr-FR')}</Text></View></View><View className="flex-row items-start gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><View className="h-8 w-8 items-center justify-center rounded-full bg-primary"><MaterialIcons name={application.status === 'Refusée' ? 'close' : application.status === 'Acceptée' ? 'check' : 'hourglass-top'} size={18} color="#fff" /></View><View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{application.status}</Text><Text className="font-sans text-label-md text-on-surface-variant">Statut actuel communiqué par le recruteur.</Text></View></View></View>
          {interview && <View className="gap-2 rounded-xl border border-secondary/30 bg-secondary-container/20 p-md"><Text className="font-sans-semibold text-label-lg text-on-surface">Entretien planifié</Text><Text className="font-sans text-body-md text-on-surface-variant">{new Date(interview.scheduled_at).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })} · {interview.mode === 'onsite' ? 'Sur site' : 'Visioconférence'}</Text>{interview.location_or_link ? <Pressable onPress={() => void openInterviewLocation()}><Text className="font-sans-semibold text-label-md text-primary">{interview.location_or_link}</Text></Pressable> : <Text className="font-sans text-label-md text-on-surface-variant">Le recruteur n’a pas encore fourni de lien ou d’adresse.</Text>}</View>}
          <View className="gap-md"><Pressable disabled={contacting} onPress={() => void contactRecruiter()} className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary-container">{contacting ? <ActivityIndicator color={colors.primary} /> : <><MaterialIcons name="mail" size={18} color={colors.onPrimaryContainer} /><Text className="font-sans-semibold text-label-lg text-on-primary-container">Contacter le recruteur</Text></>}</Pressable>{!['Acceptée', 'Refusée'].includes(application.status) && <Pressable onPress={withdraw} className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-error/30"><MaterialIcons name="cancel" size={18} color={colors.error} /><Text className="font-sans-semibold text-label-lg text-error">Retirer ma candidature</Text></Pressable>}</View>
        </ScrollView>
      ) : null}
    </View>
  );
}
