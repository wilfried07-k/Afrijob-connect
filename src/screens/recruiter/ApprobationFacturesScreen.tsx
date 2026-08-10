import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type PendingInvoice = { id: string; requester: string; amount: string; reason: string };

const PENDING: PendingInvoice[] = [
  { id: 'PO-2201', requester: 'Aïcha B. (RH)', amount: '60 000 FCFA', reason: "Vedette 30 jours — offre Développeur" },
  { id: 'PO-2198', requester: 'Marc L. (Manager)', amount: '15 000 FCFA', reason: 'Boost 7 jours — offre Comptable' },
];

export default function ApprobationFacturesScreen({ navigation }: Props) {
  const [items, setItems] = useState(PENDING);
  const decide = (id: string) => setItems((list) => list.filter((i) => i.id !== id));

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Approbation des Factures</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <Text className="mb-2 font-sans text-body-md text-on-surface-variant">
            Dépenses de votre équipe en attente de votre validation.
          </Text>
        }
        renderItem={({ item }) => (
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{item.id}</Text>
              <Text className="font-sans-bold text-title-lg text-primary">{item.amount}</Text>
            </View>
            <Text className="font-sans text-body-md text-on-surface-variant">{item.reason}</Text>
            <Text className="font-sans text-label-md text-outline">Demandé par {item.requester}</Text>
            <View className="flex-row gap-2 border-t border-outline-variant/30 pt-md">
              <Pressable onPress={() => decide(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg border border-error/30">
                <Text className="font-sans-semibold text-label-lg text-error">Rejeter</Text>
              </Pressable>
              <Pressable onPress={() => decide(item.id)} className="h-10 flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-secondary shadow-sm">
                <MaterialIcons name="approval" size={16} color="#ffffff" />
                <Text className="font-sans-semibold text-label-lg text-white">Approuver</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="check-circle" size={48} color={colors.secondary} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucune facture en attente</Text>
          </View>
        }
      />
    </View>
  );
}
