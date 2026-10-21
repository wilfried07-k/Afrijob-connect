import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { getMyBillingSubscription, listMyBillingPayments, type BillingPayment, type BillingSubscription } from '../../lib/api';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };
const dateLabel = (value: string) => new Date(value).toLocaleDateString('fr-FR');
export default function FacturationAbonnementScreen({ navigation }: Props) {
  const [subscription, setSubscription] = useState<BillingSubscription | null>(null);
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; Promise.all([getMyBillingSubscription(), listMyBillingPayments()]).then(([plan, items]) => { if (active) { setSubscription(plan); setPayments(items.slice(0, 3)); } }).catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : 'Impossible de charger la facturation.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Facturation</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="gap-md rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans text-label-lg text-on-surface-variant">Abonnement de l’entreprise</Text>
          {loading ? <ActivityIndicator color={colors.primary} /> : subscription && subscription.status === 'Actif' ? <><Text className="font-sans-extrabold text-display-lg text-primary">{subscription.plan}</Text><Text className="font-sans text-body-lg text-on-surface-variant">Actif jusqu’au {dateLabel(subscription.expires_at)}</Text></> : <><Text className="font-sans-bold text-headline-md text-on-surface">Aucun abonnement actif</Text><Text className="font-sans text-body-md text-on-surface-variant">Les demandes de paiement sont contrôlées manuellement. Un plan n’est activé qu’après validation d’une transaction.</Text></>}
          <Pressable onPress={() => navigation.navigate('TarifsEntreprises')} className="self-start rounded-xl bg-primary px-lg py-3"><Text className="font-sans-semibold text-label-lg text-on-primary">Voir les tarifs</Text></Pressable>
        </View>
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between"><Text className="font-sans-semibold text-title-lg text-on-surface">Demandes récentes</Text><Pressable onPress={() => navigation.navigate('FacturationHistorique')}><Text className="font-sans-semibold text-label-lg text-primary">Tout voir</Text></Pressable></View>
          {error ? <Text className="font-sans text-body-md text-error">{error}</Text> : loading ? <ActivityIndicator color={colors.primary} /> : payments.length ? payments.map((payment) => <View key={payment.id} className="flex-row items-center justify-between border-t border-outline-variant/20 py-3"><View><Text className="font-sans-semibold text-label-lg text-on-surface">Demande #{payment.id} · {payment.plan}</Text><Text className="font-sans text-label-md text-on-surface-variant">{dateLabel(payment.created_at)} · {payment.payment_method}</Text></View><View className="items-end"><Text className="font-sans-semibold text-label-lg text-on-surface">{payment.amount_xaf.toLocaleString('fr-FR')} FCFA</Text><Text className="font-sans text-label-md text-primary">{payment.status}</Text></View></View>) : <Text className="font-sans text-body-md text-on-surface-variant">Aucune demande de paiement.</Text>}
        </View>
        <Pressable onPress={() => navigation.navigate('SelectionModePaiement')} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"><MaterialIcons name="add-card" size={18} color="#ffffff" /><Text className="font-sans-semibold text-title-lg text-on-primary">Demander Premium (45 000 FCFA)</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('FacturationHistorique')} className="h-12 items-center justify-center rounded-xl border border-primary"><Text className="font-sans-semibold text-label-lg text-primary">Historique complet</Text></Pressable>
      </ScrollView>
    </View>
  );
}