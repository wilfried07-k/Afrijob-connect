import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import { listAdminBillingPayments, reviewBillingPayment, type BillingPayment } from '../../lib/api';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'DashboardPaiements'>;
export default function DashboardPaiementsScreen({ navigation }: Props) {
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => { setLoading(true); try { setPayments(await listAdminBillingPayments()); setError(''); } catch (err) { setError((err as Error).message || 'Impossible de charger les paiements.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const decide = (payment: BillingPayment, status: 'Payé' | 'Rejeté') => Alert.alert(status === 'Payé' ? 'Confirmer le paiement ?' : 'Rejeter cette référence ?', status === 'Payé' ? 'Vérifie la transaction dans le portail MTN ou Orange avant de confirmer. Le plan Premium sera activé pour 30 jours.' : 'La référence sera marquée comme rejetée.', [
    { text: 'Annuler', style: 'cancel' },
    { text: status === 'Payé' ? 'Confirmer' : 'Rejeter', style: status === 'Rejeté' ? 'destructive' : 'default', onPress: async () => { setBusyId(payment.id); try { await reviewBillingPayment(payment.id, status); await refresh(); } catch (err) { Alert.alert('Action impossible', (err as Error).message); } finally { setBusyId(null); } } },
  ]);
  const paid = payments.filter((item) => item.status === 'Payé');
  const revenue = paid.reduce((sum, item) => sum + item.amount_xaf, 0);
  return (
    <View className="flex-1 bg-background">
      <View className="h-14 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Vérification des paiements</Text></View>
      <FlatList data={payments.filter((item) => item.status === 'À vérifier')} keyExtractor={(item) => String(item.id)} onRefresh={refresh} refreshing={loading} contentContainerStyle={{ padding: 20, gap: 12 }} ListHeaderComponent={<View className="mb-3 gap-3"><View className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg"><Text className="font-sans text-label-lg text-on-surface-variant">Paiements confirmés</Text><Text className="font-sans-bold text-display-lg text-primary">{revenue.toLocaleString('fr-FR')} FCFA</Text><Text className="font-sans text-label-md text-on-surface-variant">{paid.length} transactions vérifiées dans la base</Text></View><Text className="font-sans-semibold text-title-lg text-on-surface">Références à vérifier</Text>{error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}</View>} ListEmptyComponent={!loading ? <Text className="py-8 text-center font-sans text-body-md text-on-surface-variant">Aucun paiement en attente de vérification.</Text> : <ActivityIndicator color={colors.primary} />} renderItem={({ item }) => <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><View className="flex-row items-center justify-between"><Text className="font-sans-semibold text-label-lg text-on-surface">Demande #{item.id} · entreprise #{item.company_id}</Text><Text className="font-sans-bold text-title-lg text-primary">{item.amount_xaf.toLocaleString('fr-FR')} FCFA</Text></View><Text className="font-sans text-body-md text-on-surface-variant">{item.plan} · {item.payment_method}</Text><Text className="font-sans text-label-md text-on-surface-variant">Référence : {item.external_reference || 'non fournie'} · {new Date(item.created_at).toLocaleString('fr-FR')}</Text><View className="flex-row gap-2 border-t border-outline-variant/30 pt-md"><Pressable disabled={busyId === item.id} onPress={() => decide(item, 'Rejeté')} className="h-10 flex-1 items-center justify-center rounded-lg border border-error/30"><Text className="font-sans-semibold text-label-lg text-error">Rejeter</Text></Pressable><Pressable disabled={busyId === item.id} onPress={() => decide(item, 'Payé')} className="h-10 flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-secondary">{busyId === item.id ? <ActivityIndicator color="#ffffff" /> : <><MaterialIcons name="approval" size={16} color="#ffffff" /><Text className="font-sans-semibold text-label-lg text-white">Paiement vérifié</Text></>}</Pressable></View></View>} />
    </View>
  );
}