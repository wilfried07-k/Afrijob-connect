import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import { getJob, listFavorites, saveFavorite, removeFavorite, type JobOffer } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'DetailOffre'>;
const formatMoney = (value: number) => new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';

export default function DetailOffreScreen({ navigation, route }: Props) {
  const jobId = route.params?.jobId;
  const [job, setJob] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;

  const title = job?.title ?? route.params?.title ?? 'Offre';
  const company = job?.company_name ?? route.params?.company ?? 'Entreprise';

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!jobId) { setLoadError('Offre introuvable.'); setLoading(false); return; }
      setLoading(true); setLoadError('');
      try {
        const data = await getJob(jobId);
        if (active) setJob(data);
        if (candidateId) {
          const favorites = await listFavorites(candidateId);
          if (active) setSaved(favorites.some((item) => item.job_offer_id === jobId));
        }
      } catch (error) {
        if (active) setLoadError((error as Error).message || 'Impossible de charger cette offre.');
      } finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [jobId, candidateId]);

  const handleToggleSave = async () => {
    if (!candidateId || !jobId) { Alert.alert('Connexion requise', 'Connecte-toi à un compte candidat pour enregistrer cette offre.'); return; }
    setSavingFavorite(true);
    try {
      if (saved) await removeFavorite(candidateId, jobId);
      else await saveFavorite(candidateId, jobId);
      setSaved(!saved);
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de modifier tes favoris.'); }
    finally { setSavingFavorite(false); }
  };

  const salary = job?.salary_min || job?.salary_max
    ? job.salary_min && job.salary_max
      ? formatMoney(job.salary_min) + ' – ' + formatMoney(job.salary_max)
      : formatMoney(job.salary_min || job.salary_max || 0)
    : 'Non précisé';

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-lg-mobile text-primary">Détail de l’offre</Text><View className="w-6" /></View>
      {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : loadError ? <Text className="px-container-margin py-xl font-sans text-body-md text-error">{loadError}</Text> : job ? <>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 24, gap: 16 }}>
          <View className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
            <View className="mb-md flex-row items-center gap-md"><View className="h-16 w-16 items-center justify-center rounded-lg bg-primary/10"><MaterialIcons name="business" size={28} color={colors.primary} /></View><View className="flex-1"><View className="flex-row items-center gap-1"><Text className="flex-1 font-sans-bold text-headline-lg leading-tight text-on-surface">{job.title}</Text>{job.company_kyc_verified && <MaterialIcons name="verified" size={18} color={colors.primary} />}</View><Text className="font-sans-semibold text-title-lg text-primary">{company}</Text></View></View>
            <View className="flex-row flex-wrap gap-2"><Tag icon="location-on" label={job.city || 'Ville non renseignée'} /><Tag icon="work" label={job.contract_type || 'Contrat non renseigné'} tint /><Tag icon="schedule" label={new Date(job.created_at).toLocaleDateString('fr-FR')} /></View>
          </View>
          <View className="flex-row gap-md"><View className="flex-1 items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 p-md"><MaterialIcons name="payments" size={24} color={colors.primary} /><Text className="text-center font-sans-medium text-[11px] uppercase tracking-wider text-on-surface-variant">Salaire mensuel</Text><Text className="text-center font-sans-semibold text-label-lg text-primary">{salary}</Text></View><View className="flex-1 items-center gap-2 rounded-lg border border-tertiary/10 bg-tertiary-fixed/20 p-md"><MaterialIcons name="work" size={24} color={colors.tertiary} /><Text className="text-center font-sans-medium text-[11px] uppercase tracking-wider text-on-surface-variant">Contrat</Text><Text className="font-sans-semibold text-title-lg text-tertiary">{job.contract_type || 'Non précisé'}</Text></View></View>
          <Section title="Description du poste" icon="description"><Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">{job.description || 'Aucune description renseignée.'}</Text></Section>
          <Section title="Profil recherché" icon="checklist"><Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">{job.requirements || 'Aucun profil détaillé renseigné.'}</Text></Section>
          <Section title={'À propos de ' + company} icon="business"><Text className="font-sans text-body-md leading-relaxed text-on-surface-variant">{job.company_description || 'Aucune description renseignée pour cette entreprise.'}</Text></Section><Pressable onPress={() => navigation.navigate('AvisCultureEntreprise', { company, companyId: job.company_id })} className={'h-12 flex-row items-center justify-center gap-2 rounded-lg border border-primary'}><MaterialIcons name="star-outline" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Consulter et donner un avis</Text></Pressable>
        </ScrollView>
        <View className="flex-row items-center gap-md border-t border-outline-variant bg-surface px-container-margin py-md">
          <Pressable disabled={savingFavorite} onPress={() => void handleToggleSave()} className="h-14 w-14 items-center justify-center rounded-lg border-2 border-outline-variant">{savingFavorite ? <ActivityIndicator color={colors.primary} /> : <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={22} color={saved ? colors.primary : colors.onSurfaceVariant} />}</Pressable>
          <Pressable onPress={() => navigation.navigate('CandidatureRapide', { title, company, jobId })} className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-primary shadow-lg"><Text className="font-sans-semibold text-label-lg text-white">Postuler maintenant</Text><MaterialIcons name="arrow-forward" size={18} color="#ffffff" /></Pressable>
        </View>
      </> : null}
    </Screen>
  );
}

function Tag({ icon, label, tint }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; tint?: boolean }) {
  return <View className={'flex-row items-center gap-1 rounded-full border px-3 py-1.5 ' + (tint ? 'border-secondary/20 bg-secondary-container/30' : 'border-outline-variant/50 bg-surface-container-low')}><MaterialIcons name={icon} size={16} color={tint ? colors.secondary : colors.onSurfaceVariant} /><Text className={'font-sans-medium text-label-lg ' + (tint ? 'text-on-secondary-container' : 'text-on-surface-variant')}>{label}</Text></View>;
}

function Section({ title, icon, children }: { title: string; icon: keyof typeof MaterialIcons.glyphMap; children: React.ReactNode }) {
  return <View className="gap-md"><View className="flex-row items-center gap-2"><View className="h-6 w-1.5 rounded-full bg-primary" /><MaterialIcons name={icon} size={18} color={colors.primary} /><Text className="font-sans-semibold text-headline-md text-on-surface">{title}</Text></View><View className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">{children}</View></View>;
}
