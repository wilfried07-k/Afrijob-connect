import { useState } from 'react';
import { ActivityIndicator, Alert, TextInput, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { submitBillingPaymentReference } from '../../lib/api';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'ValidationPaiementUSSD'>;
export default function ValidationPaiementUSSDScreen({ navigation, route }: Props) {
  const { paymentId, method, amount } = route.params;
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (reference.trim().length < 4) { Alert.alert('Référence requise', 'Saisis la référence fournie après le paiement.'); return; }
    setSaving(true);
    try {
      await submitBillingPaymentReference(paymentId, reference.trim());
      navigation.replace('PaiementReussi', { paymentId });
    } catch (error) { Alert.alert('Référence non envoyée', (error as Error).message || 'Réessaie plus tard.'); }
    finally { setSaving(false); }
  };
  return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-primary-container/20"><MaterialIcons name="receipt-long" size={44} color={colors.primary} /></View>
      <View className="items-center gap-2"><Text className="font-sans-bold text-headline-lg text-on-surface">Termine le paiement auprès de {method}</Text><Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant">Effectue le paiement de {amount.toLocaleString('fr-FR')} FCFA dans le service {method}, puis indique sa référence ci-dessous. Aucun paiement n’est lancé ni confirmé automatiquement par l’application.</Text></View>
      <TextInput value={reference} onChangeText={setReference} autoCapitalize="characters" placeholder="Référence de transaction" className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-on-surface" />
      <Text className="max-w-xs text-center font-sans text-label-md text-on-surface-variant">La référence sera vérifiée par l’administration. Ton abonnement ne sera pas activé avant cette vérification.</Text>
      <Pressable disabled={saving} onPress={submit} className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary">{saving ? <ActivityIndicator color="#ffffff" /> : <><Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer pour vérification</Text><MaterialIcons name="arrow-forward" size={18} color="#ffffff" /></>}</Pressable>
      <Pressable className="flex-row items-center gap-2" onPress={() => navigation.goBack()}><MaterialIcons name="close" size={18} color={colors.error} /><Text className="font-sans-semibold text-label-lg text-error">Annuler</Text></Pressable>
    </View>
  );
}