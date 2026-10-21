import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { listCompanyInterviews, listCompanyJobs, listJobApplications, type JobApplicationCandidate } from '../../lib/api';

type Metric = { label: string; value: string; icon: keyof typeof MaterialIcons.glyphMap; color: string };
const PIPELINE = ['Envoyée', 'En examen', 'Entretien', 'Acceptée', 'Refusée'];

export default function StatistiquesScreen() {
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [applications, setApplications] = useState<JobApplicationCandidate[]>([]);
  const [openJobs, setOpenJobs] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    if (!companyId) { setApplications([]); setOpenJobs(0); setInterviews(0); setLoading(false); return; }
    setLoading(true); setLoadError('');
    try {
      const jobs = await listCompanyJobs(companyId);
      const [groups, interviewList] = await Promise.all([
        Promise.all(jobs.map((job) => listJobApplications(job.id))),
        listCompanyInterviews(companyId),
      ]);
      setApplications(groups.flat());
      setOpenJobs(jobs.filter((job) => job.status.toLowerCase() === 'ouvert').length);
      setInterviews(interviewList.filter((interview) => !interview.status.toLowerCase().includes('annul')).length);
    } catch (error) { setLoadError((error as Error).message || 'Impossible de charger les statistiques.'); }
    finally { setLoading(false); }
  }, [companyId]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const metrics: Metric[] = [
    { label: 'Candidatures reçues', value: String(applications.length), icon: 'groups', color: colors.primary },
    { label: 'Entretiens planifiés', value: String(interviews), icon: 'event', color: colors.tertiary },
    { label: 'Offres ouvertes', value: String(openJobs), icon: 'work-outline', color: colors.secondary },
    { label: 'Candidatures en attente', value: String(applications.filter((item) => ['envoyée', 'en examen'].includes(item.status.toLowerCase())).length), icon: 'hourglass-empty', color: colors.primary },
  ];
  const counts = PIPELINE.map((status) => ({ status, count: applications.filter((item) => item.status.toLowerCase() === status.toLowerCase()).length }));
  const maxCount = Math.max(1, ...counts.map((item) => item.count));

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 24 }}>
        <View><Text className="font-sans-semibold text-title-lg text-on-surface">Vue d’ensemble</Text><Text className="font-sans text-body-md text-on-surface-variant">Données cumulées de vos offres et candidatures.</Text></View>
        {loading ? <ActivityIndicator color={colors.primary} /> : loadError ? <Text className="font-sans text-body-md text-error">{loadError}</Text> : <>
          <View className="flex-row flex-wrap justify-between gap-y-md">{metrics.map((metric) => <View key={metric.label} className="w-[48%] gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><MaterialIcons name={metric.icon} size={20} color={metric.color} /><Text className="font-sans text-label-md text-on-surface-variant">{metric.label}</Text><Text className="font-sans-bold text-headline-md text-on-surface">{metric.value}</Text></View>)}</View>
          <View className="gap-lg rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-lg shadow-md"><View><Text className="font-sans-semibold text-title-lg text-on-surface">Candidatures par étape</Text><Text className="font-sans text-body-md text-on-surface-variant">Répartition selon le statut actuel.</Text></View>
            <View className="gap-md">{counts.map((item) => <View key={item.status} className="flex-row items-center gap-md"><Text className="w-24 font-sans text-label-md text-on-surface-variant">{item.status}</Text><View className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container-high"><View className="h-full rounded-full bg-primary-container" style={{ width: `${(item.count / maxCount) * 100}%` }} /></View><Text className="w-8 text-right font-sans-semibold text-label-md text-on-surface">{item.count}</Text></View>)}</View>
          </View>
        </>}
      </ScrollView>
    </Screen>
  );
}
