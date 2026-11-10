import { useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { createBillingPayment } from '../../lib/api';

type Method = 'MTN Mobile Money' | 'Orange Money';
type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };
const METHODS: { id: Method; name: Method; icon: 'smartphone'; color: string }[] = [
  { id: 'MTN Mobile Money', name: 'MTN Mobile Money', icon: 'smartphone', color: '#FFD700' },
  { id: 'Orange Money', name: 'Orange Money', icon: 'smartphone', color: '#FF7F00' },
];

export default function SelectionModePaiementScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<Method>('MTN Mobile Money');
  const [creating, setCreating] = useState(false);
  const continueToPayment = async () => {
    setCreating(true);
    try {
      const payment = await createBillingPayment(selected);
      navigation.navigate('ValidationPaiementUSSD', { paymentId: payment.id, method: selected, amount: payment.amount_xaf });
    } catch (error) {
      Alert.alert('Demande impossible', (error as Error).message || 'Vérifie que le profil de ton entreprise est créé.');
    } finally { setCreating(false); }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Demande de paiement</Text></View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans text-label-lg text-on-surface-variant">Plan choisi</Text>
          <Text className="font-sans-extrabold text-display-lg text-primary">Premium · 45 000 FCFA</Text>
          <Text className="font-sans text-label-md text-on-surface-variant">La demande reste en attente jusqu’à la vérification de la transaction par l’administration.</Text>
        </View>
        <View className="gap-md">{METHODS.map((method) => <Pressable key={method.id} onPress={() => setSelected(method.id)} className={`flex-row items-center gap-md rounded-xl border-2 p-md ${selected === method.id ? 'border-primary bg-primary-container/5' : 'border-outline-variant bg-surface-container-lowest'}`}><View className="h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm"><MaterialIcons name={method.icon} size={20} color={method.color} /></View><Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">{method.name}</Text>{selected === method.id && <MaterialIcons name="check-circle" size={22} color={colors.primary} />}</Pressable>)}</View>
        <Pressable disabled={creating} onPress={continueToPayment} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg">{creating ? <ActivityIndicator color="#ffffff" /> : <><Text className="font-sans-semibold text-title-lg text-on-primary">Créer une demande</Text><MaterialIcons name="arrow-forward" size={18} color="#ffffff" /></>}</Pressable>
      </ScrollView>
    </View>
  );
}