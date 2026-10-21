import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { listAdminReports, resolveAdminReport, type AdminReport } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };
export default function ModerationOffresFrauduleusesScreen({ navigation }: Props) {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; listAdminReports().then((items) => { if (active) setReports(items.filter((report) => report.job_offer_id != null)); }).catch((err: unknown) => { if (active) setError((err as Error).message || 'Impossible de charger les signalements d’offres.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const removeOffer = (report: AdminReport) => Alert.alert('Retirer cette offre ?', `${report.job_title || `Offre #${report.job_offer_id}`} · ${report.reason}`, [{ text: 'Annuler', style: 'cancel' }, { text: 'Retirer', style: 'destructive', onPress: async () => { setBusyId(report.id); try { await resolveAdminReport(report.id, 'Résolu', true); setReports((items) => items.filter((item) => item.id !== report.id)); } catch (err) { Alert.alert('Action impossible', (err as Error).message || 'Réessaie plus tard.'); } finally { setBusyId(null); } } }]);
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Signalements d’offres</Text></View>
      <FlatList data={reports} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ padding: 20, gap: 12 }} ListHeaderComponent={<View className="mb-2 gap-2"><Text className="font-sans text-body-md text-on-surface-variant">Offres signalées par les utilisateurs. Un signalement doit être examiné ; il ne signifie pas automatiquement qu’une fraude est avérée.</Text>{error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}</View>} renderItem={({ item }) => <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><Text className="font-sans-semibold text-title-lg text-on-surface">{item.job_title || `Offre #${item.job_offer_id}`}</Text>{item.company_name ? <Text className="font-sans text-body-md text-primary">{item.company_name}</Text> : null}<Text className="font-sans text-body-md text-on-surface-variant">Motif : {item.reason}</Text><Text className="font-sans text-label-md text-on-surface-variant">Signalé par {item.reporter_name || `compte #${item.reported_by_user_id}`} · {new Date(item.created_at).toLocaleString('fr-FR')}</Text><Pressable disabled={busyId === item.id} onPress={() => removeOffer(item)} className="h-10 flex-row items-center justify-center gap-2 rounded-lg bg-error">{busyId === item.id ? <ActivityIndicator color="#ffffff" /> : <><MaterialIcons name="remove-circle-outline" size={16} color="#ffffff" /><Text className="font-sans-semibold text-label-lg text-on-error">Retirer l’offre</Text></>}</Pressable></View>} ListEmptyComponent={loading ? <ActivityIndicator className="mt-12" color={colors.primary} /> : <View className="items-center gap-md py-xl"><MaterialIcons name="report-problem" size={44} color={colors.secondary} /><Text className="font-sans text-body-md text-on-surface-variant">{error || 'Aucun signalement d’offre en attente.'}</Text></View>} />
    </View>
  );
}