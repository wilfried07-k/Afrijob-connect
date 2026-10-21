import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { listMyBillingPayments, type BillingPayment } from '../../lib/api';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'PaiementReussi'>;
export default function PaiementReussiScreen({ navigation, route }: Props) {
  const [payment, setPayment] = useState<BillingPayment | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; listMyBillingPayments().then((items) => { if (active) setPayment(items.find((item) => item.id === route.params.paymentId) ?? null); }).catch(() => {}).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [route.params.paymentId]);
  const verified = payment?.status === 'Payé';
  return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className={`h-28 w-28 items-center justify-center rounded-full shadow-xl ${verified ? 'bg-secondary-container' : 'bg-tertiary/10'}`}><MaterialIcons name={verified ? 'check' : 'hourglass-top'} size={56} color={verified ? colors.onSecondaryContainer : colors.primary} /></View>
      <View className="items-center gap-2"><Text className="font-sans-bold text-headline-lg text-on-surface">{verified ? 'Paiement vérifié' : 'Demande envoyée'}</Text><Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant">{verified ? 'La transaction a été vérifiée par l’administration.' : 'La référence a été transmise. Ton abonnement ne sera activé qu’après vérification de la transaction.'}</Text></View>
      <View className="w-full gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
        {loading ? <ActivityIndicator color={colors.primary} /> : payment ? <>
          <View className="flex-row justify-between"><Text className="font-sans text-label-md text-on-surface-variant">Demande</Text><Text className="font-sans-semibold text-label-md text-on-surface">#{payment.id}</Text></View>
          <View className="flex-row justify-between"><Text className="font-sans text-label-md text-on-surface-variant">Référence saisie</Text><Text className="font-sans-semibold text-label-md text-on-surface">{payment.external_reference || 'Aucune'}</Text></View>
          <View className="flex-row justify-between"><Text className="font-sans text-label-md text-on-surface-variant">Montant</Text><Text className="font-sans-semibold text-label-md text-on-surface">{payment.amount_xaf.toLocaleString('fr-FR')} FCFA</Text></View>
          <View className="flex-row justify-between"><Text className="font-sans text-label-md text-on-surface-variant">État</Text><Text className="font-sans-semibold text-label-md text-primary">{payment.status}</Text></View>
        </> : <Text className="font-sans text-label-md text-on-surface-variant">Demande de paiement introuvable.</Text>}
      </View>
      <Pressable onPress={() => navigation.navigate('FacturationHistorique')} className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"><Text className="font-sans-semibold text-title-lg text-on-primary">Voir l’historique</Text></Pressable>
    </View>
  );
}