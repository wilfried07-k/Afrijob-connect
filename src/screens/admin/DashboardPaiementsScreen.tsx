import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'DashboardPaiements'>;

const METHODS = [
  { label: 'MTN MoMo', amount: '1 200k', percent: 45, color: '#FFD700' },
  { label: 'Orange Money', amount: '950k', percent: 38, color: '#FF7F00' },
  { label: 'USSD / Banque', amount: '300k', percent: 17, color: colors.primary },
];

const WEEKLY = [30, 55, 45, 80, 65, 40, 25];

type TxStatus = 'success' | 'pending' | 'failed';

type Transaction = {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: TxStatus;
};

const TRANSACTIONS: Transaction[] = [
  { id: '#TRX-9821-OM', date: '24 Mai, 14:30', amount: '15 000 FCFA', method: 'Orange Money', status: 'success' },
  { id: '#TRX-9820-MM', date: '24 Mai, 13:15', amount: '25 000 FCFA', method: 'MTN MoMo', status: 'pending' },
  { id: '#TRX-9819-BK', date: '23 Mai, 18:02', amount: '40 000 FCFA', method: 'Virement Bancaire', status: 'failed' },
];

const STATUS_STYLE: Record<TxStatus, { label: string; bg: string; text: string }> = {
  success: { label: 'Réussi', bg: 'bg-secondary/10', text: 'text-secondary' },
  pending: { label: 'En attente', bg: 'bg-tertiary/10', text: 'text-tertiary' },
  failed: { label: 'Échoué', bg: 'bg-error/10', text: 'text-error' },
};

export default function DashboardPaiementsScreen({ navigation }: Props) {
  const [period, setPeriod] = useState('7 jours');

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Gestion des Paiements</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Revenue */}
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans text-label-lg text-on-surface-variant">Revenus du mois</Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="font-sans-bold text-display-lg text-primary">2 450 000</Text>
            <Text className="font-sans text-label-lg text-primary/70">FCFA</Text>
          </View>
          <View className="mt-1 flex-row items-center gap-1">
            <MaterialIcons name="trending-up" size={18} color={colors.secondary} />
            <Text className="font-sans-medium text-label-md text-secondary">+12.5% vs mois dernier</Text>
          </View>
        </View>

        {/* Method breakdown */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Répartition par Méthode</Text>
          <View className="gap-md">
            {METHODS.map((m) => (
              <View key={m.label} className="gap-1">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
                    <Text className="font-sans text-label-md text-on-surface-variant">{m.label}</Text>
                  </View>
                  <Text className="font-sans-semibold text-title-lg text-on-surface">{m.amount}</Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View className="h-full rounded-full" style={{ width: `${m.percent}%`, backgroundColor: m.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Trend chart */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Tendance des Transactions</Text>
          </View>
          <View className="flex-row gap-2">
            {['7 jours', '30 jours', 'Année'].map((p) => {
              const active = p === period;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  className={`rounded-full px-md py-1 ${active ? 'bg-primary-container' : 'bg-surface-container-high'}`}
                >
                  <Text className={`font-sans-medium text-label-md ${active ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View className="h-32 flex-row items-end gap-2">
            {WEEKLY.map((v, i) => (
              <View key={i} className="flex-1 rounded-t-md bg-primary/60" style={{ height: `${v}%` }} />
            ))}
          </View>
        </View>

        {/* Transactions */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Transactions Récentes</Text>
          <View className="gap-2">
            {TRANSACTIONS.map((tx) => {
              const style = STATUS_STYLE[tx.status];
              return (
                <View key={tx.id} className="gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-sans-bold text-label-lg text-primary">{tx.id}</Text>
                    <View className={`rounded-full px-2 py-0.5 ${style.bg}`}>
                      <Text className={`font-sans-semibold text-[10px] ${style.text}`}>{style.label}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-sans text-label-md text-on-surface-variant">{tx.date}</Text>
                    <Text className="font-sans-semibold text-title-lg text-on-surface">{tx.amount}</Text>
                  </View>
                  <Text className="font-sans text-label-md text-on-surface-variant">{tx.method}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('GestionRemboursements')}
          className="h-12 flex-row items-center justify-center gap-2 rounded-full border border-primary"
        >
          <MaterialIcons name="assignment-return" size={18} color={colors.primary} />
          <Text className="font-sans-semibold text-label-lg text-primary">Voir les demandes de remboursement</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
