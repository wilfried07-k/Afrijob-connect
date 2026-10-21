import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { getCandidateProfile, type CandidateProfilePublic } from '../../lib/api';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'DetailsCandidat'>;

export default function DetailsCandidatScreen({ navigation, route }: Props) {
  const [candidate, setCandidate] = useState<CandidateProfilePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const applicationId = route.params?.applicationId;

  useEffect(() => {
    let active = true;
    const load = async () => {
      const candidateId = route.params?.candidateId;
      if (!candidateId) { setLoadError('Le profil du candidat est introuvable.'); setLoading(false); return; }
      try {
        const profile = await getCandidateProfile(candidateId);
        if (active) setCandidate(profile);
      } catch (error) { if (active) setLoadError((error as Error).message || 'Impossible de charger le profil.'); }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [route.params?.candidateId]);

  const name = candidate?.full_name ?? route.params?.name ?? 'Candidat';
  const role = candidate?.job_title ?? route.params?.role ?? 'Profil professionnel';
  const schedule = () => {
    if (!applicationId) { Alert.alert('Candidature manquante', 'Cet entretien doit être planifié depuis une candidature reçue.'); return; }
    navigation.navigate('PlanifierEntretien', { applicationId, candidateName: name, role });
  };

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Profil candidat</Text><View className="w-6" /></View>
      {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : loadError ? <Text className="px-container-margin py-xl font-sans text-body-md text-error">{loadError}</Text> : candidate ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
          <View className="gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
            <View className="flex-row items-center gap-md"><View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10"><Text className="font-sans-bold text-headline-lg text-primary">{name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View><View className="flex-1"><Text className="font-sans-bold text-headline-lg text-on-surface">{name}</Text><Text className="font-sans-semibold text-title-lg text-primary">{role}</Text><Text className="mt-1 font-sans text-label-md text-on-surface-variant">{candidate.city || 'Ville non renseignée'} · {candidate.years_experience ?? '—'} ans d’expérience</Text></View></View>
            <Pressable onPress={schedule} className="h-11 flex-row items-center justify-center gap-2 rounded-full bg-primary"><MaterialIcons name="event" size={16} color="#ffffff" /><Text className="font-sans-semibold text-label-lg text-on-primary">Planifier un entretien</Text></Pressable>
          </View>
          <View className="gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-lg"><View className="flex-row items-center gap-2"><MaterialIcons name="person" size={20} color={colors.primary} /><Text className="font-sans-semibold text-headline-md text-on-surface">Résumé professionnel</Text></View><Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">{candidate.summary || 'Aucun résumé professionnel renseigné.'}</Text></View>
          <View className="gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-lg"><View className="flex-row items-center gap-2"><MaterialIcons name="psychology" size={20} color={colors.primary} /><Text className="font-sans-semibold text-headline-md text-on-surface">Compétences</Text></View>{candidate.skills.length ? <View className="flex-row flex-wrap gap-2">{candidate.skills.map((skill) => <View key={skill} className="rounded-lg bg-surface-container-high px-md py-2"><Text className="font-sans-medium text-label-md text-on-surface-variant">{skill}</Text></View>)}</View> : <Text className="font-sans text-body-md text-on-surface-variant">Aucune compétence renseignée.</Text>}</View>
        </ScrollView>
      ) : null}
    </Screen>
  );
}
