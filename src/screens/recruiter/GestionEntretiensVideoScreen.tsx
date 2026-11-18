import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, Pressable, Text, View } from 'react-native';
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
  const v = status.toLowerCase();
  if (v.includes('annul') || v.includes('cancel')) return 'cancelled';
  if (v.includes('termin') || v.includes('complet')) return 'done';
  return 'upcoming';
}

function InterviewCard({
  item,
  onNavigate,
  onUpdateStatus,
}: {
  item: InterviewSummary;
  onNavigate: (screen: keyof RecruiterStackParamList, params?: object) => void;
  onUpdateStatus: (item: InterviewSummary, status: string) => void;
}) {
  const isUpcoming = statusGroup(item.status) === 'upcoming';
  const isVideoLink = item.location_or_link && /^https?:\/\//i.test(item.location_or_link);

  const openLink = async () => {
    if (!item.location_or_link) return;
    if (isVideoLink) {
      try {
        await Linking.openURL(item.location_or_link);
      } catch {
        Alert.alert('Lien indisponible', "Impossible d'ouvrir ce lien.");
      }
    } else {
      Alert.alert('Adresse', item.location_or_link);
    }
  };

  return (
    <View className="gap-md rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
      {/* Header: avatar + infos */}
      <Pressable
        onPress={() =>
          item.candidate_id &&
          onNavigate('DetailsCandidat', {
            applicationId: item.application_id,
            candidateId: item.candidate_id,
            name: item.candidate_name,
            role: item.job_title,
          })
        }
        className="flex-row items-center gap-md"
      >
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Text className="font-sans-bold text-label-lg text-primary">
            {(item.candidate_name || 'C').split(' ').map((p) => p[0]).join('').slice(0, 2)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-title-lg text-on-surface">{item.candidate_name || 'Candidat'}</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">{item.job_title || 'Entretien'}</Text>
          <Text className="mt-0.5 font-sans text-label-md text-on-surface-variant">
            {new Date(item.scheduled_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
          </Text>
        </View>
        {item.candidate_id && (
          <MaterialIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
        )}
      </Pressable>

      {/* Mode + status badge */}
      <View className="flex-row items-center gap-2">
        <MaterialIcons
          name={item.mode === 'onsite' ? 'location-on' : 'videocam'}
          size={15}
          color={colors.onSurfaceVariant}
        />
        <Text className="font-sans text-label-md text-on-surface-variant">
          {item.mode === 'onsite' ? 'Sur site' : 'Visioconférence'} · {item.status}
        </Text>
      </View>

      {/* Link / Address */}
      {item.location_or_link ? (
        <Pressable
          onPress={() => void openLink()}
          className="flex-row items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-md py-2"
        >
          <MaterialIcons name={isVideoLink ? 'video-call' : 'location-on'} size={16} color={colors.primary} />
          <Text numberOfLines={1} className="flex-1 font-sans-semibold text-label-md text-primary">
            {item.location_or_link}
          </Text>
          <MaterialIcons name="open-in-new" size={14} color={colors.primary} />
        </Pressable>
      ) : null}

      {/* Report link */}
      {item.report_status ? (
        <Pressable
          onPress={() =>
            onNavigate('ValidationRapportRH', {
              interviewId: item.interview_id,
              candidateName: item.candidate_name,
              role: item.job_title,
            })
          }
          className="h-10 items-center justify-center rounded-lg border border-secondary"
        >
          <Text className="font-sans-semibold text-label-lg text-secondary">
            Consulter le rapport · {item.report_status}
          </Text>
        </Pressable>
      ) : null}

      {/* Actions for upcoming interviews */}
      {isUpcoming && (
        <View className="flex-row gap-2">
          <Pressable
            onPress={() =>
              onNavigate('NotesEntretien', {
                interviewId: item.interview_id,
                candidateName: item.candidate_name,
                role: item.job_title,
              })
            }
            className="h-10 flex-1 items-center justify-center rounded-lg border border-primary"
          >
            <Text className="font-sans-semibold text-label-lg text-primary">Préparer mes notes</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert('Terminer cet entretien ?', '', [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Terminer', onPress: () => onUpdateStatus(item, 'Terminée') },
              ])
            }
            className="h-10 items-center justify-center rounded-lg bg-surface-container-high px-md"
          >
            <Text className="font-sans-semibold text-label-lg text-on-surface">Terminer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
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
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible de mettre à jour cet entretien.');
    }
  };

  const items = interviews.filter((i) => statusGroup(i.status) === filter);

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Entretiens</Text>
        <View className="w-6" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.interview_id)}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-md">
            <View className="flex-row items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-md">
              <MaterialIcons name="info-outline" size={20} color={colors.primary} />
              <Text className="flex-1 font-sans text-label-md text-on-surface-variant">
                Ajoutez un lien de visioconférence ou une adresse lors de la planification. Appuyez sur le nom du candidat pour consulter son dossier.
              </Text>
            </View>
            <View className="flex-row gap-2">
              {FILTERS.map((f) => (
                <Pressable
                  key={f.value}
                  onPress={() => setFilter(f.value)}
                  className={`rounded-full px-md py-2 ${filter === f.value ? 'bg-primary-container' : 'bg-surface-container-high'}`}
                >
                  <Text className={`font-sans-medium text-label-md ${filter === f.value ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <InterviewCard
            item={item}
            onNavigate={(screen, params) => navigation.navigate(screen as never, params as never)}
            onUpdateStatus={updateStatus}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View className="items-center gap-md py-xl">
              <MaterialIcons name="event-busy" size={48} color={colors.outline} />
              <Text className={`font-sans text-body-md ${loadError ? 'text-error' : 'text-on-surface-variant'}`}>
                {loadError || 'Aucun entretien dans cette liste.'}
              </Text>
            </View>
          )
        }
      />
    </Screen>
  );
}
