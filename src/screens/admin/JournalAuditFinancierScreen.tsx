import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Entry = { id: string; action: string; amount: string; actor: string; timeAgo: string; type: 'in' | 'out' };

const ENTRIES: Entry[] = [
  { id: '1', action: 'Abonnement Premium — TechCamer', amount: '+45 000 FCFA', actor: 'Système', timeAgo: 'Il y a 1h', type: 'in' },
  { id: '2', action: 'Remboursement traité — REF-9276', amount: '-120 000 FCFA', actor: 'Admin Principal', timeAgo: 'Il y a 3h', type: 'out' },
  { id: '3', action: 'Sponsoring offre — Global Trade', amount: '+35 000 FCFA', actor: 'Système', timeAgo: 'Il y a 5h', type: 'in' },
];

export default function JournalAuditFinancierScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Journal d'Audit Financier</Text>
      </View>

      <FlatList
        data={ENTRIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className={`h-11 w-11 items-center justify-center rounded-full ${item.type === 'in' ? 'bg-secondary/10' : 'bg-error/10'}`}>
              <MaterialIcons name={item.type === 'in' ? 'call-received' : 'call-made'} size={18} color={item.type === 'in' ? colors.secondary : colors.error} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{item.action}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{item.actor} • {item.timeAgo}</Text>
            </View>
            <Text className={`font-sans-bold text-label-lg ${item.type === 'in' ? 'text-secondary' : 'text-error'}`}>{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}
