import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { listMyBillingPayments, type BillingPayment } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };
export default function FacturationHistoriqueScreen({ navigation }: Props) {
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; listMyBillingPayments().then((items) => { if (active) setPayments(items); }).catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : 'Impossible de charger les paiements.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Historique de facturation</Text></View>
      <FlatList data={payments} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ padding: 20, gap: 10 }} ListEmptyComponent={loading ? <ActivityIndicator color={colors.primary} /> : <Text className="py-8 text-center font-sans text-body-md text-on-surface-variant">{error || 'Aucune demande de paiement enregistrée.'}</Text>} renderItem={({ item }) => <View className="flex-row items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><View className="flex-row items-center gap-md"><MaterialIcons name="receipt-long" size={20} color={colors.onSurfaceVariant} /><View><Text className="font-sans-semibold text-label-lg text-on-surface">Demande #{item.id} · {item.plan}</Text><Text className="font-sans text-label-md text-on-surface-variant">{new Date(item.created_at).toLocaleString('fr-FR')}</Text><Text className="font-sans text-label-md text-on-surface-variant">{item.payment_method}{item.external_reference ? ` · ${item.external_reference}` : ''}</Text></View></View><View className="items-end"><Text className="font-sans-semibold text-label-lg text-on-surface">{item.amount_xaf.toLocaleString('fr-FR')} FCFA</Text><Text className="font-sans text-label-md text-primary">{item.status}</Text></View></View>} />
    </View>
  );
}