import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const QUARTERS = ['T1 2026', 'T2 2026', 'T3 2026', 'T4 2025'];

const KPIS = [
  { label: 'Nouveaux inscrits', value: '38 200', trend: '+18%', positive: true },
  { label: 'Coût d\u2019acquisition moyen', value: '620 FCFA', trend: '-8%', positive: true },
  { label: 'Taux de rétention (90j)', value: '64%', trend: '+4pts', positive: true },
  { label: 'Budget dépensé', value: '4.2M FCFA', trend: '+12%', positive: false },
];

const MONTHLY = [
  { month: 'Avril', value: 55 },
  { month: 'Mai', value: 72 },
  { month: 'Juin', value: 90 },
];
const MAX_MONTHLY = Math.max(...MONTHLY.map((m) => m.value));

export default function RapportMarketingTrimestrielScreen({ navigation }: Props) {
  const [quarter, setQuarter] = useState(QUARTERS[0]);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Rapport Trimestriel</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row gap-2">
          {QUARTERS.map((q) => {
            const active = q === quarter;
            return (
              <Pressable
                key={q}
                onPress={() => setQuarter(q)}
                className={`rounded-full px-md py-2 ${active ? 'bg-primary' : 'bg-surface-container-high'}`}
              >
                <Text className={`font-sans-semibold text-label-md ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>{q}</Text>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-row flex-wrap gap-2">
          {KPIS.map((kpi) => (
            <View key={kpi.label} className="min-w-[47%] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <Text className="font-sans text-[11px] text-on-surface-variant">{kpi.label}</Text>
              <Text className="font-sans-bold text-headline-md text-on-surface">{kpi.value}</Text>
              <View className={`flex-row items-center gap-1 self-start rounded-full px-2 py-0.5 ${kpi.positive ? 'bg-secondary-container/20' : 'bg-error-container/20'}`}>
                <MaterialIcons name="trending-up" size={12} color={kpi.positive ? colors.secondary : colors.error} />
                <Text className="text-[10px] font-sans-semibold" style={{ color: kpi.positive ? colors.secondary : colors.error }}>
                  {kpi.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Nouveaux inscrits par mois</Text>
          <View className="h-32 flex-row items-end gap-3">
            {MONTHLY.map((m) => (
              <View key={m.month} className="flex-1 items-center gap-2">
                <View className="w-full rounded-t-md bg-primary/70" style={{ height: `${(m.value / MAX_MONTHLY) * 100}%` }} />
                <Text className="font-sans text-label-md text-on-surface-variant">{m.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row gap-md">
          <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-primary">
            <MaterialIcons name="picture-as-pdf" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Exporter en PDF</Text>
          </Pressable>
          <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-sm">
            <MaterialIcons name="share" size={18} color="#ffffff" />
            <Text className="font-sans-semibold text-label-lg text-on-primary">Partager</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
