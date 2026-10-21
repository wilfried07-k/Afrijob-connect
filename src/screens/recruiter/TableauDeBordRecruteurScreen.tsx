import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { RecruiterStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { listCompanyInterviews, listCompanyJobs, listJobApplications, type JobOffer } from '../../lib/api';

type Metric = { key: string; label: string; value: string; icon: keyof typeof MaterialIcons.glyphMap; iconBg: string; iconColor: string; subtitle: string };

export default function TableauDeBordRecruteurScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [newApplications, setNewApplications] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    if (!companyId) { setJobs([]); setLoading(false); return; }
    setLoading(true); setLoadError('');
    try {
      const companyJobs = await listCompanyJobs(companyId);
      const [applicationGroups, interviews] = await Promise.all([
        Promise.all(companyJobs.map((job) => listJobApplications(job.id))),
        listCompanyInterviews(companyId),
      ]);
      const applications = applicationGroups.flat();
      setJobs(companyJobs.sort((a, b) => b.created_at.localeCompare(a.created_at)));
      setApplicationCount(applications.length);
      setNewApplications(applications.filter((item) => item.status.toLowerCase() === 'envoyée').length);
      setInterviewCount(interviews.filter((item) => !item.status.toLowerCase().includes('annul') && !item.status.toLowerCase().includes('termin')).length);
    } catch (error) { setLoadError((error as Error).message || 'Impossible de charger le tableau de bord.'); }
    finally { setLoading(false); }
  }, [companyId]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const activeJobs = jobs.filter((job) => job.status.toLowerCase() === 'ouvert');
  const metrics: Metric[] = [
    { key: 'active', label: 'Offres actives', value: String(activeJobs.length), icon: 'business-center', iconBg: 'bg-primary/10', iconColor: colors.primary, subtitle: 'Offres actuellement ouvertes' },
    { key: 'applications', label: 'Candidatures', value: String(applicationCount), icon: 'person-add', iconBg: 'bg-secondary-container/20', iconColor: colors.secondary, subtitle: `${newApplications} nouvelles` },
    { key: 'interviews', label: 'Entretiens à venir', value: String(interviewCount), icon: 'calendar-today', iconBg: 'bg-tertiary-fixed/30', iconColor: colors.tertiary, subtitle: 'Entretiens planifiés' },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 24 }}>
        <View className="gap-1"><Text className="font-sans-bold text-headline-lg text-on-surface">Bonjour, {authState.profile?.company_name || authState.profile?.full_name || 'Recruteur'} 👋</Text><Text className="font-sans text-body-md text-on-surface-variant">Suivez vos offres et candidatures.</Text></View>
        <View className="flex-row flex-wrap gap-2"><Pressable className="flex-row items-center justify-center gap-2 rounded-full bg-primary px-lg py-3" onPress={() => navigation.navigate('PublierOffre')}><MaterialIcons name="add" size={18} color="#ffffff" /><Text className="font-sans-semibold text-label-lg text-on-primary">Publier une offre</Text></Pressable><Pressable className="flex-row items-center justify-center gap-2 rounded-full border border-primary px-lg py-3" onPress={() => navigation.navigate('GestionEntretiensVideo')}><MaterialIcons name="event" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Entretiens</Text></Pressable></View>
        {loading ? <ActivityIndicator color={colors.primary} /> : loadError ? <Text className="font-sans text-body-md text-error">{loadError}</Text> : <>
          <View className="gap-md">{metrics.map((metric) => <View key={metric.key} className="flex-row items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg"><View><Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-on-surface-variant">{metric.label}</Text><Text className="font-sans-bold text-display-lg text-on-surface">{metric.value}</Text><Text className="font-sans text-label-md text-on-surface-variant">{metric.subtitle}</Text></View><View className={`h-10 w-10 items-center justify-center rounded-full ${metric.iconBg}`}><MaterialIcons name={metric.icon} size={20} color={metric.iconColor} /></View></View>)}</View>
          <View className="gap-md"><View className="flex-row items-center justify-between"><Text className="font-sans-semibold text-headline-md text-on-surface">Mes offres récentes</Text><Pressable onPress={() => navigation.navigate('RecruiterTabs', { screen: 'GestionDesOffres' })}><Text className="font-sans-semibold text-label-lg text-primary">Voir tout</Text></Pressable></View>
            {jobs.slice(0, 5).length ? jobs.slice(0, 5).map((job) => <Pressable key={job.id} onPress={() => navigation.navigate('RecruiterTabs', { screen: 'GestionDesOffres' })} className="flex-row items-center gap-md rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-md"><View className="h-12 w-12 items-center justify-center rounded-md bg-surface-container-high"><MaterialIcons name="work-outline" size={22} color={colors.onSurfaceVariant} /></View><View className="flex-1"><Text className="font-sans-semibold text-title-lg text-on-surface" numberOfLines={1}>{job.title}</Text><Text className="font-sans text-label-md text-on-surface-variant">{job.city || 'Ville non précisée'} · {new Date(job.created_at).toLocaleDateString('fr-FR')}</Text></View><Text className={`font-sans-semibold text-label-md ${job.status.toLowerCase() === 'ouvert' ? 'text-secondary' : 'text-on-surface-variant'}`}>{job.status}</Text></Pressable>) : <Text className="font-sans text-body-md text-on-surface-variant">Vous n’avez pas encore publié d’offre.</Text>}
          </View>
        </>}
        <View className="flex-row gap-md"><Pressable onPress={() => navigation.navigate('RecruiterTabs', { screen: 'GestionDesCandidats' })} className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><MaterialIcons name="groups" size={22} color={colors.primary} /><Text className="text-center font-sans-semibold text-label-md text-on-surface">Candidats</Text></Pressable><Pressable onPress={() => navigation.navigate('RecruiterTabs', { screen: 'GestionDesOffres' })} className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><MaterialIcons name="work-outline" size={22} color={colors.primary} /><Text className="text-center font-sans-semibold text-label-md text-on-surface">Mes offres</Text></Pressable></View>
      </ScrollView>
    </Screen>
  );
}
