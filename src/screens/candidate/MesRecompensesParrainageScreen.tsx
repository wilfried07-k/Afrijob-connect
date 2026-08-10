import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Reward = { id: string; label: string; amount: string; status: 'Disponible' | 'Retiré' | 'En attente'; date: string };

const REWARDS: Reward[] = [
  { id: '1', label: 'Parrainage — Paul Etoundi embauché', amount: '5 000 FCFA', status: 'Disponible', date: '28 Juin 2026' },
  { id: '2', label: 'Bonus de bienvenue', amount: '1 000 FCFA', status: 'Retiré', date: '10 Mai 2026' },
  { id: '3', label: 'Parrainage — Christelle M. en entretien', amount: '5 000 FCFA', status: 'En attente', date: '02 Juil 2026' },
];

const STATUS_STYLE: Record<Reward['status'], { bg: string; text: string }> = {
  Disponible: { bg: 'bg-secondary/10', text: 'text-secondary' },
  Retiré: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
  'En attente': { bg: 'bg-tertiary/10', text: 'text-tertiary' },
};

export default function MesRecompensesParrainageScreen({ navigation }: Props) {
  const availableTotal = REWARDS.filter((r) => r.status === 'Disponible').length * 5000;

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mes Récompenses</Text>
      </View>

      <FlatList
        data={REWARDS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2 gap-md rounded-2xl bg-primary p-lg shadow-lg">
            <Text className="font-sans text-label-lg text-white/80">Solde disponible</Text>
            <Text className="font-sans-extrabold text-display-lg text-white">
              {new Intl.NumberFormat('fr-FR').format(availableTotal)} FCFA
            </Text>
            <Pressable className="mt-1 flex-row items-center justify-center gap-2 rounded-xl bg-white py-3">
              <MaterialIcons name="redeem" size={18} color={colors.primary} />
              <Text className="font-sans-semibold text-label-lg text-primary">Retirer vers Mobile Money</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const style = STATUS_STYLE[item.status];
          return (
            <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <MaterialIcons name="card-giftcard" size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.label}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">{item.date}</Text>
              </View>
              <View className="items-end gap-1">
                <Text className="font-sans-bold text-label-lg text-on-surface">{item.amount}</Text>
                <View className={`rounded-full px-2 py-0.5 ${style.bg}`}>
                  <Text className={`text-[10px] font-sans-bold ${style.text}`}>{item.status}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
