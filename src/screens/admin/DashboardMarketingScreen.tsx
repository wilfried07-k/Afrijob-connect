import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'DashboardMarketing'>;

const KPIS: {
  key: string;
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  trend: string;
  positive: boolean;
}[] = [
  { key: 'signups', label: "Nombre total d'inscrits", value: '128 432', icon: 'group', iconBg: 'bg-primary/10', iconColor: colors.primary, trend: '+12%', positive: true },
  { key: 'conversion', label: 'Taux de conversion', value: '24.8%', icon: 'sync-alt', iconBg: 'bg-secondary/10', iconColor: colors.secondary, trend: '+3.2%', positive: true },
  { key: 'roi', label: 'ROI Campagnes Push', value: '5.8x', icon: 'campaign', iconBg: 'bg-tertiary/10', iconColor: colors.tertiary, trend: '+15%', positive: true },
  { key: 'mau', label: 'MAU (Actifs Mensuels)', value: '42 910', icon: 'insights', iconBg: 'bg-surface-container-high', iconColor: colors.onSurface, trend: '-0.5%', positive: false },
];

const ACQUISITION = [
  { channel: 'Réseaux sociaux', value: 45, color: colors.primary },
  { channel: 'Recommandations', value: 30, color: colors.secondary },
  { channel: 'Recherche organique', value: 15, color: colors.tertiary },
  { channel: 'Publicité payante', value: 10, color: colors.outline },
];

const CAMPAIGNS = [
  { id: '1', name: 'Rentrée des talents 2026', status: 'Active', reach: '1.2M', clicks: '84k' },
  { id: '2', name: 'Semaine du Recruteur Pro', status: 'Active', reach: '650k', clicks: '32k' },
  { id: '3', name: 'Parrainage Candidat x2', status: 'Terminée', reach: '2.1M', clicks: '190k' },
];

export default function DashboardMarketingScreen({ navigation }: Props) {
  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Performance Marketing</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-bold text-headline-lg text-on-surface">Vue d'ensemble</Text>
          <Pressable
            onPress={() => navigation.navigate('ExportationRapport')}
            className="flex-row items-center gap-1 rounded-xl bg-primary px-md py-2"
          >
            <MaterialIcons name="download" size={16} color="#ffffff" />
            <Text className="font-sans-semibold text-label-md text-white">Exporter</Text>
          </Pressable>
        </View>

        {/* KPIs */}
        <View className="flex-row flex-wrap gap-2">
          {KPIS.map((kpi) => (
            <View key={kpi.key} className="min-w-[47%] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className="flex-row items-start justify-between">
                <View className={`h-10 w-10 items-center justify-center rounded-full ${kpi.iconBg}`}>
                  <MaterialIcons name={kpi.icon} size={20} color={kpi.iconColor} />
                </View>
                <View className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${kpi.positive ? 'bg-secondary-container/20' : 'bg-error-container/20'}`}>
                  <MaterialIcons name={kpi.positive ? 'trending-up' : 'trending-down'} size={12} color={kpi.positive ? colors.secondary : colors.error} />
                  <Text className="text-[10px] font-sans-semibold" style={{ color: kpi.positive ? colors.secondary : colors.error }}>
                    {kpi.trend}
                  </Text>
                </View>
              </View>
              <Text className="font-sans text-[11px] text-on-surface-variant">{kpi.label}</Text>
              <Text className="font-sans-bold text-headline-md text-on-surface">{kpi.value}</Text>
            </View>
          ))}
        </View>

        {/* Acquisition breakdown */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Canaux d'acquisition</Text>
          <View className="gap-md">
            {ACQUISITION.map((a) => (
              <View key={a.channel} className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans text-label-md text-on-surface-variant">{a.channel}</Text>
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{a.value}%</Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View className="h-full rounded-full" style={{ width: `${a.value}%`, backgroundColor: a.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Campaigns */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Campagnes en cours</Text>
          <View className="gap-2">
            {CAMPAIGNS.map((c) => (
              <View key={c.id} className="gap-2 rounded-xl border border-outline-variant/30 bg-white p-md shadow-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-semibold text-title-lg text-on-surface">{c.name}</Text>
                  <View className={`rounded-full px-2 py-0.5 ${c.status === 'Active' ? 'bg-secondary/10' : 'bg-surface-container-high'}`}>
                    <Text className={`font-sans-semibold text-[10px] ${c.status === 'Active' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {c.status}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-lg">
                  <View>
                    <Text className="font-sans text-[10px] text-on-surface-variant">Portée</Text>
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{c.reach}</Text>
                  </View>
                  <View>
                    <Text className="font-sans text-[10px] text-on-surface-variant">Clics</Text>
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{c.clicks}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row gap-md">
          <Pressable
            onPress={() => navigation.navigate('RapportMarketingTrimestriel')}
            className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-primary"
          >
            <MaterialIcons name="calendar-view-month" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Rapport trimestriel</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('GestionCampagnesSMSEmail')}
            className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-primary"
          >
            <MaterialIcons name="sms" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Campagnes SMS/Email</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
