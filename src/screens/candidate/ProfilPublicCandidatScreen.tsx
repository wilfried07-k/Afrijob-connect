import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { getCandidateProfile, type CandidateProfilePublic } from '../../lib/api';

type Props = NativeStackScreenProps<CandidateStackParamList, 'ProfilPublicCandidat'>;

export default function ProfilPublicCandidatScreen({ navigation, route }: Props) {
  const { authState } = useAuth();
  const candidateId = route.params?.candidateId ?? authState.profile?.candidate_profile_id;
  const isOwnProfile = candidateId === authState.profile?.candidate_profile_id;
  const [profile, setProfile] = useState<CandidateProfilePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!candidateId) { setLoadError('Profil candidat introuvable.'); setLoading(false); return; }
      try {
        const data = await getCandidateProfile(candidateId);
        if (active) setProfile(data);
      } catch (error) { if (active) setLoadError((error as Error).message || 'Impossible de charger le profil.'); }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [candidateId]);

  const name = profile?.full_name || 'Candidat';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Profil public</Text><View className="w-6" /></View>
      {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : loadError ? <Text className="px-container-margin py-xl font-sans text-body-md text-error">{loadError}</Text> : profile ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="h-24 w-full bg-primary/90" />
          <View className="-mt-10 px-container-margin">
            <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-surface bg-surface shadow-md"><Text className="font-sans-bold text-headline-lg text-primary">{initials}</Text></View>
            <Text className="mt-md font-sans-bold text-headline-lg text-on-surface">{name}</Text>
            <Text className="font-sans-semibold text-title-lg text-primary">{profile.job_title || 'Titre professionnel non renseigné'}</Text>
            <View className="mt-1 flex-row items-center gap-1"><MaterialIcons name="location-on" size={16} color={colors.onSurfaceVariant} /><Text className="font-sans text-label-lg text-on-surface-variant">{profile.city || 'Ville non renseignée'} · {profile.years_experience ?? 'Expérience non renseignée'}{profile.years_experience !== undefined ? ' ans' : ''}</Text></View>
            {isOwnProfile && <Pressable onPress={() => navigation.navigate('CreationProfilCandidat')} className="mt-md self-start rounded-lg bg-primary px-lg py-3"><Text className="font-sans-semibold text-label-lg text-on-primary">Modifier mon profil</Text></Pressable>}
          </View>
          <View className="gap-md px-container-margin py-lg">
            <View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm"><View className="mb-md flex-row items-center gap-2"><MaterialIcons name="person-search" size={20} color={colors.primary} /><Text className="font-sans-semibold text-headline-md text-on-surface">Résumé professionnel</Text></View><Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">{profile.summary || 'Aucun résumé professionnel renseigné.'}</Text></View>
            <View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm"><View className="mb-md flex-row items-center gap-2"><MaterialIcons name="bolt" size={20} color={colors.primary} /><Text className="font-sans-semibold text-headline-md text-on-surface">Compétences</Text></View>{profile.skills.length ? <View className="flex-row flex-wrap gap-2">{profile.skills.map((skill) => <View key={skill} className="rounded-full border border-outline-variant/20 bg-surface-container-low px-md py-1"><Text className="font-sans text-label-md text-on-surface-variant">{skill}</Text></View>)}</View> : <Text className="font-sans text-body-md text-on-surface-variant">Aucune compétence renseignée.</Text>}</View>
            <View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm"><View className="mb-md flex-row items-center gap-2"><MaterialIcons name="military-tech" size={20} color={colors.tertiary} /><Text className="font-sans-semibold text-headline-md text-on-surface">Évaluations EmploiCamer</Text></View>{profile.assessments?.length ? profile.assessments.map((assessment) => <View key={assessment.id} className="mb-2 flex-row items-center justify-between rounded-lg bg-surface-container-low p-md"><View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{assessment.test_name}</Text><Text className="font-sans text-label-md text-on-surface-variant">{assessment.badge} · {new Date(assessment.created_at).toLocaleDateString('fr-FR')}</Text></View><Text className="font-sans-bold text-title-lg text-primary">{assessment.percentage}%</Text></View>) : <Text className="font-sans text-body-md text-on-surface-variant">Aucune évaluation passée.</Text>}<Text className="font-sans mt-2 text-label-md text-on-surface-variant">Ces quiz ne constituent pas une certification accréditée.</Text></View>
<View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm"><View className="mb-md flex-row items-center gap-2"><MaterialIcons name="collections-bookmark" size={20} color={colors.primary} /><Text className="font-sans-semibold text-headline-md text-on-surface">Projets du portfolio</Text></View>{profile.projects?.length ? profile.projects.map((project) => <View key={project.id} className="mb-3 gap-2 rounded-lg bg-surface-container-low p-md"><Text className="font-sans-semibold text-label-lg text-on-surface">{project.title}</Text><Text className="font-sans text-body-md text-on-surface-variant">{project.description}</Text>{project.skills.length ? <Text className="font-sans text-label-md text-primary">{project.skills.join(' · ')}</Text> : null}{project.url ? <Pressable onPress={() => void Linking.openURL(project.url!)} className="flex-row items-center gap-2"><MaterialIcons name="open-in-new" size={16} color={colors.primary} /><Text className="font-sans text-label-md text-primary">{project.url}</Text></Pressable> : null}</View>) : <Text className="font-sans text-body-md text-on-surface-variant">Aucun projet ajouté au portfolio.</Text>}</View>
<View className="flex-row items-start gap-2 rounded-xl border border-tertiary/20 bg-tertiary-fixed/20 p-md"><MaterialIcons name="info-outline" size={18} color={colors.tertiary} /><Text className="flex-1 font-sans text-label-md text-on-surface-variant">Les expériences détaillées, formations et fichiers CV ne sont pas encore affichés dans ce profil.</Text></View>
          </View>
        </ScrollView>
      ) : null}
    </Screen>
  );
}
