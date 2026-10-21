import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, View, Text, Pressable, FlatList, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { deleteAlert, listAlerts, updateAlert, type JobAlertItem } from '../../lib/api';

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
};

const FREQUENCY_LABELS: Record<string, string> = {
  instant: 'Instantané',
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
};
export default function GestionAlertesEmploiScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const [alerts, setAlerts] = useState<JobAlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refreshAlerts = useCallback(async () => {
    if (!candidateId) {
      setAlerts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    try {
      setAlerts(await listAlerts(candidateId));
    } catch (error) {
      setLoadError((error as Error).message || 'Impossible de charger les alertes.');
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useFocusEffect(useCallback(() => {
    void refreshAlerts();
  }, [refreshAlerts]));

  const toggle = async (item: JobAlertItem) => {
    try {
      const updated = await updateAlert(item.id, { active: !item.active });
      setAlerts((list) => list.map((alert) => alert.id === updated.id ? updated : alert));
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible de modifier cette alerte.');
    }
  };

  const remove = (id: number) => {
    Alert.alert('Supprimer cette alerte ?', 'Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAlert(id);
            setAlerts((list) => list.filter((alert) => alert.id !== id));
          } catch (error) {
            Alert.alert('Erreur', (error as Error).message || 'Impossible de supprimer cette alerte.');
          }
        },
      },
    ]);
  };

  const frequencyLabel = (frequency: string) => FREQUENCY_LABELS[frequency] ?? frequency;
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Alertes Emploi</Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        ListHeaderComponent={
          <View className="mb-2 gap-md">
            <View>
              <Text className="font-sans-semibold text-headline-md text-on-surface">Vos alertes actives</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">
                Soyez les premiers informés des nouvelles opportunités.
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('CreerAlerteEmploi')}
              className="items-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary-fixed/20 py-lg"
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-container">
                <MaterialIcons name="add-alert" size={24} color={colors.onPrimaryContainer} />
              </View>
              <Text className="font-sans-semibold text-label-lg text-primary">Créer une nouvelle alerte</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row items-start justify-between">
              <Pressable
                className="flex-1"
                onPress={() => navigation.navigate('DetailsAlerteEmploi', { alertId: item.id, title: item.title, location: item.city ?? '' })}
              >
                <Text className="font-sans-semibold text-title-lg text-on-surface">{item.title}</Text>
                <View className="mt-1 flex-row flex-wrap gap-2">
                  <View className="flex-row items-center gap-1 rounded-full bg-surface-container-high px-3 py-1">
                    <MaterialIcons name="location-on" size={14} color={colors.onSurfaceVariant} />
                    <Text className="font-sans text-label-md text-on-surface-variant">{item.city ?? 'Toutes les villes'}</Text>
                  </View>
                  <View className="flex-row items-center gap-1 rounded-full bg-secondary-container/30 px-3 py-1">
                    <MaterialIcons name="schedule" size={14} color={colors.onSecondaryContainer} />
                    <Text className="font-sans text-label-md text-on-secondary-container">{frequencyLabel(item.frequency)}</Text>
                  </View>
                </View>
              </Pressable>
              <Switch value={item.active} onValueChange={() => void toggle(item)} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
            </View>
            <View className="flex-row items-center justify-between border-t border-outline-variant/30 pt-md">
              <Text className="font-sans italic text-label-md text-on-surface-variant">{item.active ? 'Alerte active' : 'Alerte suspendue'}</Text>
              <View className="flex-row gap-1">
                <Pressable className="rounded-lg p-2" onPress={() => navigation.navigate('CreerAlerteEmploi', { alertId: item.id, title: item.title })}>
                  <MaterialIcons name="edit" size={18} color={colors.primary} />
                </Pressable>
                <Pressable className="rounded-lg p-2" onPress={() => remove(item.id)}>
                  <MaterialIcons name="delete-outline" size={18} color={colors.error} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : loadError ? (
            <Text className="py-xl text-center font-sans text-body-md text-error">{loadError}</Text>
          ) : (
            <View className="items-center gap-md py-xl">
              <MaterialIcons name="notifications-off" size={48} color={colors.outline} />
              <Text className="font-sans text-body-md text-on-surface-variant">Aucune alerte configurée</Text>
            </View>
          )
        }
      />
    </View>
  );
}
