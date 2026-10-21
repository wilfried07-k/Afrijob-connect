import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { listAdminReports, resolveAdminReport, type AdminReport } from '../../lib/api';

export default function ModerationLitigesScreen() {
  const [items, setItems] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const refresh = useCallback(async () => { setLoading(true); try { setItems(await listAdminReports()); setError(''); } catch (err) { setError((err as Error).message || 'Impossible de charger les signalements.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const resolve = async (reportId: number, status: 'Résolu' | 'Escaladé', removeJob = false) => {
    setBusyId(reportId);
    try { await resolveAdminReport(reportId, status, removeJob); setItems((list) => list.filter((report) => report.id !== reportId)); }
    catch (err) { Alert.alert('Action impossible', (err as Error).message || 'Réessaie plus tard.'); }
    finally { setBusyId(null); }
  };
  const confirm = (report: AdminReport, status: 'Résolu' | 'Escaladé', removeJob = false) => Alert.alert(removeJob ? 'Retirer cette offre ?' : status === 'Escaladé' ? 'Escalader ce signalement ?' : 'Résoudre ce signalement ?', `Signalement #${report.id} · ${report.reason}`, [{ text: 'Annuler', style: 'cancel' }, { text: removeJob ? 'Retirer' : status, style: removeJob ? 'destructive' : 'default', onPress: () => void resolve(report.id, status, removeJob) }]);
  return (
    <Screen>
      <View className="gap-1 px-container-margin pb-md pt-md"><Text className="font-sans-bold text-headline-lg text-on-surface">Modération</Text><Text className="font-sans text-body-md text-on-surface-variant">Signalements envoyés par les utilisateurs et en attente de traitement.</Text></View>
      <FlatList data={items} keyExtractor={(item) => String(item.id)} onRefresh={refresh} refreshing={loading} contentContainerStyle={{ padding: 20, gap: 12 }} ListHeaderComponent={<View className="mb-2 gap-2"><View className="flex-row items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><MaterialIcons name="pending-actions" size={20} color={colors.primary} /><Text className="flex-1 font-sans text-label-lg text-on-surface-variant">Signalements en attente</Text><Text className="font-sans-bold text-headline-md text-primary">{items.length}</Text></View>{error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}</View>} renderItem={({ item }) => <View className="gap-md rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-md shadow-sm"><View className="flex-row items-start gap-md"><View className="h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low"><MaterialIcons name={item.job_offer_id ? 'work' : 'person'} size={20} color={colors.onSurfaceVariant} /></View><View className="flex-1"><Text className="font-sans-semibold text-title-lg text-on-surface">{item.job_title || (item.reported_user_name ? `Compte : ${item.reported_user_name}` : `Signalement #${item.id}`)}</Text>{item.company_name ? <Text className="font-sans-medium text-body-md text-primary">{item.company_name}</Text> : null}<Text className="mt-1 font-sans text-body-md text-on-surface-variant">Motif : {item.reason}</Text><Text className="mt-2 font-sans text-label-md text-on-surface-variant">Signalé par {item.reporter_name || `compte #${item.reported_by_user_id}`} · {new Date(item.created_at).toLocaleString('fr-FR')}</Text></View></View><View className="flex-row gap-md border-t border-outline-variant/30 pt-md"><Pressable disabled={busyId === item.id} onPress={() => confirm(item, 'Résolu', Boolean(item.job_offer_id))} className="h-10 flex-1 items-center justify-center rounded-lg border border-outline"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">{item.job_offer_id ? 'Retirer l’offre' : 'Résoudre'}</Text></Pressable><Pressable disabled={busyId === item.id} onPress={() => confirm(item, 'Escaladé')} className="h-10 flex-1 items-center justify-center rounded-lg bg-primary"><Text className="font-sans-semibold text-label-lg text-on-primary">Escalader</Text></Pressable></View></View>} ListEmptyComponent={loading ? <ActivityIndicator className="mt-12" color={colors.primary} /> : <View className="items-center gap-md py-xl"><MaterialIcons name="verified-user" size={48} color={colors.secondary} /><Text className="font-sans text-body-md text-on-surface-variant">{error || 'Aucun signalement en attente.'}</Text></View>} />
    </Screen>
  );
}