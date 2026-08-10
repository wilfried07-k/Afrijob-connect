import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Period = 'Semaine' | 'Mois' | 'Année';

type Kpi = {
  key: string;
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendIcon?: keyof typeof MaterialIcons.glyphMap;
  trendPositive?: boolean;
};

const KPIS: Kpi[] = [
  { key: 'apps', label: 'Total Candidatures', value: '1 284', icon: 'group', iconBg: 'bg-primary/10', iconColor: colors.primary, trend: '+12%', trendIcon: 'trending-up', trendPositive: true },
  { key: 'interview_rate', label: "Taux d'Entretien", value: '24.8%', icon: 'chat', iconBg: 'bg-tertiary-fixed/30', iconColor: colors.tertiary, trend: 'Stable' },
  { key: 'time_to_hire', label: 'Temps de Recrutement', value: '18 Jours', icon: 'schedule', iconBg: 'bg-secondary-container/30', iconColor: colors.secondary, trend: '-2j', trendIcon: 'trending-down', trendPositive: true },
  { key: 'cost', label: 'Coût par Recrutement', value: '45 000 CFA', icon: 'payments', iconBg: 'bg-primary/10', iconColor: colors.primary, trend: '+5%', trendIcon: 'trending-up', trendPositive: false },
];

const WEEKLY_DATA = [
  { day: 'Lun', value: 42 },
  { day: 'Mar', value: 68 },
  { day: 'Mer', value: 55 },
  { day: 'Jeu', value: 91 },
  { day: 'Ven', value: 74 },
  { day: 'Sam', value: 30 },
  { day: 'Dim', value: 18 },
];

const MAX_VALUE = Math.max(...WEEKLY_DATA.map((d) => d.value));

export default function StatistiquesScreen() {
  const [period, setPeriod] = useState<Period>('Semaine');

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 24 }}>
        {/* Period selector */}
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Vue d'ensemble</Text>
          <View className="flex-row gap-1 rounded-lg bg-surface-container p-1">
            {(['Semaine', 'Mois', 'Année'] as Period[]).map((p) => {
              const active = p === period;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  className={`rounded-md px-3 py-1.5 ${active ? 'bg-white shadow-sm' : ''}`}
                >
                  <Text className={`font-sans-medium text-label-md ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* KPI grid */}
        <View className="flex-row flex-wrap justify-between gap-y-md">
          {KPIS.map((kpi) => (
            <View
              key={kpi.key}
              className="w-[48%] gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className="flex-row items-start justify-between">
                <View className={`h-9 w-9 items-center justify-center rounded-lg ${kpi.iconBg}`}>
                  <MaterialIcons name={kpi.icon} size={18} color={kpi.iconColor} />
                </View>
                {kpi.trend && (
                  <View
                    className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${
                      kpi.trendPositive === false ? 'bg-error/10' : 'bg-secondary-container/20'
                    }`}
                  >
                    {kpi.trendIcon && (
                      <MaterialIcons
                        name={kpi.trendIcon}
                        size={12}
                        color={kpi.trendPositive === false ? colors.error : colors.secondary}
                      />
                    )}
                    <Text
                      className="text-[10px] font-sans-semibold"
                      style={{ color: kpi.trendPositive === false ? colors.error : colors.secondary }}
                    >
                      {kpi.trend}
                    </Text>
                  </View>
                )}
              </View>
              <View>
                <Text className="text-[11px] font-sans-medium text-on-surface-variant">{kpi.label}</Text>
                <Text className="font-sans-bold text-headline-md text-on-surface">{kpi.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View className="gap-lg rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-lg shadow-md">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-sans-semibold text-title-lg text-on-surface">Candidatures reçues</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">
                Évolution du volume sur les 7 derniers jours
              </Text>
            </View>
            <Pressable className="flex-row items-center gap-1">
              <Text className="font-sans-semibold text-label-md text-primary">PDF</Text>
              <MaterialIcons name="download" size={16} color={colors.primary} />
            </Pressable>
          </View>

          <View className="h-48 flex-row items-end justify-between gap-2 px-1">
            {WEEKLY_DATA.map((d) => (
              <View key={d.day} className="flex-1 items-center gap-2">
                <Text className="font-sans-bold text-[10px] text-on-surface-variant">{d.value}</Text>
                <View
                  className="w-full rounded-t-md bg-primary-container/70"
                  style={{ height: `${(d.value / MAX_VALUE) * 100}%` }}
                />
                <Text className="font-sans text-label-md text-on-surface-variant">{d.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
