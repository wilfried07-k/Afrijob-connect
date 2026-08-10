import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'TableauDeBordConformite'>;

const RISK_METRICS = [
  { label: 'Comptes conformes', value: '94%', icon: 'verified-user' as const, color: colors.secondary, bg: 'bg-secondary/10' },
  { label: 'À risque', value: '18', icon: 'warning' as const, color: colors.error, bg: 'bg-error/10' },
  { label: 'Vérifications en cours', value: '32', icon: 'hourglass-top' as const, color: colors.primary, bg: 'bg-primary/10' },
];

const QUICK_LINKS: { icon: keyof typeof MaterialIcons.glyphMap; label: string; screen: keyof AdminStackParamList }[] = [
  { icon: 'payments', label: 'Paiements', screen: 'DashboardPaiements' },
  { icon: 'assignment-return', label: 'Remboursements', screen: 'GestionRemboursements' },
  { icon: 'history-edu', label: "Journal d'audit", screen: 'JournalAudit' },
];

const COMPANIES_AT_RISK = [
  { name: 'Kmer Digital Services', issue: 'Statuts manquants', risk: 'Moyen' },
  { name: 'BuildRight Cameroun', issue: 'RCCM expiré', risk: 'Élevé' },
  { name: 'TransAfrica Logistics', issue: 'Vérification NIU en attente', risk: 'Faible' },
];

const RISK_STYLE: Record<string, { bg: string; text: string }> = {
  Élevé: { bg: 'bg-error/10', text: 'text-error' },
  Moyen: { bg: 'bg-tertiary/10', text: 'text-tertiary' },
  Faible: { bg: 'bg-secondary/10', text: 'text-secondary' },
};

export default function TableauDeBordConformiteScreen({ navigation }: Props) {
  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="shield" size={20} color={colors.primary} />
          <Text className="font-sans-bold text-headline-md text-primary">Compliance Hub</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Risk metrics */}
        <View className="flex-row flex-wrap gap-2">
          {RISK_METRICS.map((m) => (
            <View key={m.label} className="min-w-[100px] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className={`h-9 w-9 items-center justify-center rounded-full ${m.bg}`}>
                <MaterialIcons name={m.icon} size={18} color={m.color} />
              </View>
              <Text className="font-sans text-[11px] text-on-surface-variant">{m.label}</Text>
              <Text className="font-sans-bold text-headline-md" style={{ color: m.color }}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Quick links */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Accès rapide</Text>
          <View className="flex-row flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Pressable
                key={link.label}
                onPress={() => navigation.navigate(link.screen)}
                className="min-w-[100px] flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
              >
                <MaterialIcons name={link.icon} size={22} color={colors.primary} />
                <Text className="text-center font-sans-semibold text-label-md text-on-surface">{link.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* At-risk companies */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Entreprises à surveiller</Text>
          <View className="gap-2">
            {COMPANIES_AT_RISK.map((c) => {
              const style = RISK_STYLE[c.risk];
              return (
                <View key={c.name} className="flex-row items-center justify-between gap-md rounded-xl border border-outline-variant/30 bg-white p-md shadow-sm">
                  <View className="h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high">
                    <MaterialIcons name="apartment" size={18} color={colors.onSurfaceVariant} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{c.name}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">{c.issue}</Text>
                  </View>
                  <View className={`rounded-full px-2 py-1 ${style.bg}`}>
                    <Text className={`font-sans-semibold text-[10px] ${style.text}`}>{c.risk}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
