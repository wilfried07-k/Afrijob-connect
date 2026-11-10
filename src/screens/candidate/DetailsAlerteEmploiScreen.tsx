import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { deleteAlert, getAlertMatches, listAlerts, updateAlert, type JobAlertItem, type JobOffer } from '../../lib/api';

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
  route?: { params?: { alertId?: number; title?: string; location?: string } };
};

const FREQUENCY_LABELS: Record<string, string> = {
  instant: 'Instantané',
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
};
export default function DetailsAlerteEmploiScreen({ navigation, route }: Props) {
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const alertId = route?.params?.alertId;
  const [alertRecord, setAlertRecord] = useState<JobAlertItem | null>(null);
  const [matches, setMatches] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!candidateId || alertId === undefined) {
        setLoadError('Alerte introuvable.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [alerts, jobs] = await Promise.all([
          listAlerts(candidateId),
          getAlertMatches(alertId),
        ]);
        if (active) {
          setAlertRecord(alerts.find((item) => item.id === alertId) ?? null);
          setMatches(jobs);
        }
      } catch (error) {
        if (active) setLoadError((error as Error).message || 'Impossible de charger les détails de l’alerte.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [alertId, candidateId]);

  const title = alertRecord?.title ?? route?.params?.title ?? 'Alerte emploi';
  const location = alertRecord?.city ?? route?.params?.location ?? 'Toutes les villes';
  const frequencyLabel = (frequency: string) => FREQUENCY_LABELS[frequency] ?? frequency;

  const toggleActive = async (active: boolean) => {
    if (!alertRecord) return;
    try {
      setAlertRecord(await updateAlert(alertRecord.id, { active }));
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible de modifier cette alerte.');
    }
  };

  const removeAlert = () => {
    if (!alertRecord) return;
    Alert.alert('Supprimer cette alerte ?', 'Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAlert(alertRecord.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erreur', (error as Error).message || 'Impossible de supprimer cette alerte.');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Détails de l'alerte</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-headline-md text-on-surface">{title}</Text>
            <Switch value={alertRecord?.active ?? false} onValueChange={toggleActive} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="location-on" size={16} color={colors.onSurfaceVariant} />
            <Text className="font-sans text-body-md text-on-surface-variant">{location}</Text>
          </View>
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Critères de l'alerte</Text>
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Fréquence</Text>
              <Text className="font-sans-semibold text-label-lg text-on-surface">{alertRecord ? frequencyLabel(alertRecord.frequency) : '—'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Créée le</Text>
              <Text className="font-sans-semibold text-label-lg text-on-surface">{alertRecord ? new Date(alertRecord.created_at).toLocaleDateString('fr-FR') : '—'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Offres trouvées</Text>
              <Text className="font-sans-semibold text-label-lg text-primary">{matches.length}</Text>
            </View>
          </View>
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Dernières offres correspondantes</Text>
          <View className="gap-2">
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : loadError ? (
              <Text className="text-body-md text-error">{loadError}</Text>
            ) : matches.length === 0 ? (
              <Text className="text-body-md text-on-surface-variant">Aucune offre ne correspond encore à cette alerte.</Text>
            ) : matches.map((job) => (
              <Pressable
                key={job.id}
                onPress={() => navigation.navigate('DetailOffre', {
                  jobId: job.id,
                  title: job.title,
                  company: job.company_name ?? 'Entreprise',
                })}
                className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
              >
                <View className="h-11 w-11 items-center justify-center rounded-lg bg-surface-container-high">
                  <MaterialIcons name="work-outline" size={20} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{job.title}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">{job.company_name ?? 'Entreprise'}</Text>
                </View>
                <Text className="font-sans text-[11px] text-outline">{new Date(job.created_at).toLocaleDateString('fr-FR')}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={removeAlert} className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-error/30">
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
          <Text className="font-sans-semibold text-label-lg text-error">Supprimer cette alerte</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
