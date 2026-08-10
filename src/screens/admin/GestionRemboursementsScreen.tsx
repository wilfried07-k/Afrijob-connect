import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'GestionRemboursements'>;

type RefundStatus = 'initiated' | 'pending' | 'settling';

type RefundRequest = {
  id: string;
  requester: string;
  amount: string;
  reason: string;
  status: RefundStatus;
  timeAgo: string;
};

const REQUESTS: RefundRequest[] = [
  { id: 'REF-9283-XPL', requester: 'Kamdem Solutions', amount: '45 000 FCFA', reason: 'Offre annulée après paiement', status: 'pending', timeAgo: 'Il y a 1h' },
  { id: 'REF-9281-QRT', requester: 'Sarah B.', amount: '15 000 FCFA', reason: 'Double facturation', status: 'initiated', timeAgo: 'Il y a 3h' },
  { id: 'REF-9276-MNB', requester: 'Digital Corp SA', amount: '120 000 FCFA', reason: 'Service Premium non reçu', status: 'settling', timeAgo: 'Il y a 1j' },
];

const STEPS: { key: RefundStatus; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'initiated', label: 'Initiée', icon: 'check' },
  { key: 'pending', label: 'En attente', icon: 'hourglass-top' },
  { key: 'settling', label: 'Règlement', icon: 'account-balance' },
];

function StatusStepper({ status }: { status: RefundStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  return (
    <View className="flex-row items-center">
      {STEPS.map((step, i) => {
        const active = i <= currentIndex;
        return (
          <View key={step.key} className="flex-1 items-center">
            <View className="w-full flex-row items-center">
              {i > 0 && <View className={`h-[2px] flex-1 ${i <= currentIndex ? 'bg-primary' : 'bg-outline-variant'}`} />}
              <View
                className={`h-7 w-7 items-center justify-center rounded-full ${active ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <MaterialIcons name={step.icon} size={14} color={active ? '#ffffff' : colors.outline} />
              </View>
              {i < STEPS.length - 1 && <View className={`h-[2px] flex-1 ${i < currentIndex ? 'bg-primary' : 'bg-outline-variant'}`} />}
            </View>
            <Text className={`mt-1 text-[10px] font-sans-semibold ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function GestionRemboursementsScreen({ navigation }: Props) {
  const [requests, setRequests] = useState(REQUESTS);

  const settle = (id: string) => setRequests((list) => list.filter((r) => r.id !== id));

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Remboursements</Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        ListHeaderComponent={
          <Text className="mb-2 font-sans text-body-md text-on-surface-variant">
            {requests.length} demandes de remboursement en cours de traitement.
          </Text>
        }
        renderItem={({ item }) => (
          <View className="gap-md rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-lg shadow-sm">
            <View className="flex-row items-start justify-between">
              <View>
                <View className="mb-1 self-start rounded-md bg-secondary-container px-2 py-0.5">
                  <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-on-secondary-container">
                    Demande en direct
                  </Text>
                </View>
                <Text className="font-sans-semibold text-headline-md text-primary">{item.id}</Text>
              </View>
              <Text className="font-sans-bold text-title-lg text-on-surface">{item.amount}</Text>
            </View>

            <StatusStepper status={item.status} />

            <View className="gap-1 border-t border-outline-variant/30 pt-md">
              <Text className="font-sans text-label-md text-on-surface-variant">
                Demandeur : <Text className="font-sans-semibold text-on-surface">{item.requester}</Text>
              </Text>
              <Text className="font-sans text-label-md text-on-surface-variant">Motif : {item.reason}</Text>
              <Text className="font-sans text-label-md text-outline">{item.timeAgo}</Text>
            </View>

            <View className="flex-row gap-2">
              <Pressable className="h-10 flex-1 items-center justify-center rounded-lg border border-outline">
                <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Détails</Text>
              </Pressable>
              <Pressable onPress={() => settle(item.id)} className="h-10 flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-primary shadow-sm">
                <MaterialIcons name="undo" size={16} color="#ffffff" />
                <Text className="font-sans-semibold text-label-lg text-on-primary">Traiter</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="account-balance-wallet" size={48} color={colors.secondary} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucune demande en attente</Text>
          </View>
        }
      />
    </Screen>
  );
}
