import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

const METHODS = [
  { id: 'mtn', name: 'MTN Mobile Money', icon: 'smartphone' as const, color: '#FFD700' },
  { id: 'orange', name: 'Orange Money', icon: 'smartphone' as const, color: '#FF7F00' },
  { id: 'card', name: 'Carte bancaire', icon: 'credit-card' as const, color: '#004ac6' },
];

export default function SelectionModePaiementScreen({ navigation }: Props) {
  const [selected, setSelected] = useState('mtn');

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mode de Paiement</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans text-label-lg text-on-surface-variant">Montant à payer</Text>
          <Text className="font-sans-extrabold text-display-lg text-primary">45 000 FCFA</Text>
          <Text className="font-sans text-label-md text-on-surface-variant">Abonnement Premium — 1 mois</Text>
        </View>

        <View className="gap-md">
          {METHODS.map((m) => {
            const active = m.id === selected;
            return (
              <Pressable
                key={m.id}
                onPress={() => setSelected(m.id)}
                className={`flex-row items-center gap-md rounded-xl border-2 p-md ${active ? 'border-primary bg-primary-container/5' : 'border-outline-variant bg-surface-container-lowest'}`}
              >
                <View className="h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                  <MaterialIcons name={m.icon} size={20} color={m.color} />
                </View>
                <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">{m.name}</Text>
                {active && <MaterialIcons name="check-circle" size={22} color={colors.primary} />}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => navigation.navigate('ValidationPaiementUSSD')}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">Continuer</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
