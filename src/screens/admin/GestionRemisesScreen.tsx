import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Discount = { id: string; code: string; percent: number; usage: string; active: boolean };

const DISCOUNTS: Discount[] = [
  { id: '1', code: 'RENTREE2026', percent: 20, usage: '142 utilisations', active: true },
  { id: '2', code: 'PARTENAIRE10', percent: 10, usage: '58 utilisations', active: true },
  { id: '3', code: 'PROMO2025', percent: 15, usage: '890 utilisations', active: false },
];

export default function GestionRemisesScreen({ navigation }: Props) {
  const [discounts, setDiscounts] = useState(DISCOUNTS);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">Codes de Remise</Text>
        </View>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-primary">
          <MaterialIcons name="add" size={20} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={discounts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <MaterialIcons name="local-offer" size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-label-lg text-on-surface">{item.code}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{item.usage}</Text>
            </View>
            <View className="items-end gap-1">
              <View className="flex-row items-center gap-1 rounded-full bg-secondary-container/30 px-2 py-0.5">
                <MaterialIcons name="percent" size={12} color={colors.onSecondaryContainer} />
                <Text className="text-[10px] font-sans-bold text-on-secondary-container">{item.percent}%</Text>
              </View>
              <Text className={`text-[10px] font-sans-bold ${item.active ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {item.active ? 'Actif' : 'Expiré'}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
