import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const INVOICES = [
  { id: 'INV-2026-014', date: '15 Juin 2026', amount: '45 000 FCFA', status: 'Payée' },
  { id: 'INV-2026-013', date: '15 Mai 2026', amount: '45 000 FCFA', status: 'Payée' },
  { id: 'INV-2026-012', date: '15 Avril 2026', amount: '45 000 FCFA', status: 'Payée' },
  { id: 'INV-2026-011', date: '15 Mars 2026', amount: '35 000 FCFA', status: 'Payée' },
  { id: 'INV-2026-010', date: '15 Fév 2026', amount: '35 000 FCFA', status: 'Payée' },
];

const FILTERS = ['Toutes', '2026', '2025'];

export default function FacturationHistoriqueScreen({ navigation }: Props) {
  const [filter, setFilter] = useState('Toutes');

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Historique de Facturation</Text>
      </View>

      <FlatList
        data={INVOICES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        ListHeaderComponent={
          <View className="mb-2 flex-row gap-2">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  className={`rounded-full px-md py-2 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <Text className={`font-sans-semibold text-label-md ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>{f}</Text>
                </Pressable>
              );
            })}
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row items-center gap-md">
              <MaterialIcons name="receipt-long" size={20} color={colors.onSurfaceVariant} />
              <View>
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.id}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">{item.date}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{item.amount}</Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="check-circle" size={12} color={colors.secondary} />
                <Text className="font-sans text-[10px] text-secondary">{item.status}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
