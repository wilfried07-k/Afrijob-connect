import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { listCandidateApplications, type ApplicationDetail } from '../../lib/api';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'SuiviCandidatures'>;

type Status = 'interview' | 'review' | 'rejected' | 'accepted';


const FILTERS: { label: string; value: 'Toutes' | Status }[] = [
  { label: 'Toutes', value: 'Toutes' },
  { label: 'En examen', value: 'review' },
  { label: 'Entretien', value: 'interview' },
  { label: 'RefusÃ©es', value: 'rejected' },
  { label: 'AcceptÃ©es', value: 'accepted' },
];

const STATUS_STYLE: Record<Status, { bg: string; text: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  interview: { bg: 'bg-secondary-container/30', text: 'text-on-secondary-container', icon: 'event' },
  review: { bg: 'bg-primary/10', text: 'text-primary', icon: 'hourglass-top' },
  rejected: { bg: 'bg-error/10', text: 'text-error', icon: 'close' },
  accepted: { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'check-circle' },
};

export default function SuiviCandidaturesScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const [filter, setFilter] = useState<'Toutes' | Status>('Toutes');
  const [applications, setApplications] = useState<ApplicationDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeStatus = (status: string): Status => {
    if (status === 'Entretien') return 'interview';
    if (status === 'En examen') return 'review';
    if (status === 'RefusÃ©e') return 'rejected';
    if (status === 'AcceptÃ©e') return 'accepted';
    return 'review';
  };

  const filteredApplications = applications.filter((application) => {
    if (filter === 'Toutes') return true;
    return normalizeStatus(application.status) === filter;
  });

  const totals = {
    total: applications.length,
    review: applications.filter((application) => normalizeStatus(application.status) === 'review').length,
    interview: applications.filter((application) => normalizeStatus(application.status) === 'interview').length,
    rejected: applications.filter((application) => normalizeStatus(application.status) === 'rejected').length,
    accepted: applications.filter((application) => normalizeStatus(application.status) === 'accepted').length,
  };

  useEffect(() => {
    const load = async () => {
      try {
        const candidateId = authState.profile?.candidate_profile_id;
        if (candidateId) {
          const res = await listCandidateApplications(candidateId);
          setApplications(res);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('Erreur chargement candidatures', err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authState.profile]);

  return (
    <Screen>
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.navigate('CandidateTabs')} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Mes Candidatures</Text>
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-lg">
            {/* Stats */}
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: 'Total', value: String(totals.total), color: colors.primary },
                { label: 'En cours', value: String(totals.review), color: colors.primary },
                { label: 'Entretiens', value: String(totals.interview), color: colors.secondary },
                { label: 'RefusÃ©es', value: String(totals.rejected), color: colors.error },
                { label: 'AcceptÃ©es', value: String(totals.accepted), color: colors.secondary },
              ].map((stat) => (
                <View key={stat.label} className="w-[47%] gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                  <Text className="font-sans text-label-md text-on-surface-variant">{stat.label}</Text>
                  <Text className="font-sans-bold text-headline-md" style={{ color: stat.color }}>
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Filters */}
            <View className="flex-row flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = f.value === filter;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilter(f.value)}
                    className={`rounded-full px-lg py-2 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}
                  >
                    <Text className={`font-sans-semibold text-label-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const statusKey = normalizeStatus(item.status);
          const style = STATUS_STYLE[statusKey];
          const detail =
            item.status === 'Entretien'
              ? 'Entretien planifiÃ©'
              : item.status === 'En examen'
              ? 'Candidature en cours de traitement'
              : item.status === 'RefusÃ©e'
              ? "Offre non retenue"
              : item.status === 'AcceptÃ©e'
              ? 'Offre acceptÃ©e'
              : 'Candidature envoyÃ©e';
          const timeAgo = item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '';

          return (
            <Pressable
              onPress={() => {
                if (statusKey === 'interview') {
                  navigation.navigate('ConfirmationEntretien', { company: item.company_name, position: item.job_title });
                } else {
                  navigation.navigate('DetailsCandidature', { applicationId: item.id, title: item.job_title, company: item.company_name });
                }
              }}
              className="rounded-lg border border-outline-variant bg-white p-md shadow-sm"
            >
              <View className="mb-sm flex-row items-start justify-between gap-2">
                <View className="flex-1 flex-row items-center gap-md">
                  <View className="h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/20 bg-surface-container-high">
                    <MaterialIcons name="business" size={20} color={colors.onSurfaceVariant} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-title-lg text-on-surface">{item.job_title}</Text>
                    <Text className="font-sans text-body-md text-on-surface-variant">
                      {item.company_name}
                    </Text>
                  </View>
                </View>
                <View className={`rounded-full px-3 py-1 ${style.bg}`}>
                  <Text className={`font-sans-semibold text-label-md ${style.text}`}>{item.status}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between border-t border-outline-variant/30 pt-sm">
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name={style.icon} size={18} color={style.text.includes('error') ? colors.error : colors.secondary} />
                  <Text className="font-sans-semibold text-label-lg" style={{ color: colors.onSurfaceVariant }}>
                    {detail}
                  </Text>
                </View>
                <Text className="font-sans text-label-md text-on-surface-variant">{timeAgo}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="description" size={48} color={colors.outline} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucune candidature ici</Text>
          </View>
        }
      />
    </Screen>
  );
}
