import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { AdminTabParamList, AdminStackParamList } from '../../navigation/types';

type Stat = {
  key: string;
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  trend?: string;
  urgent?: boolean;
};

const STATS: Stat[] = [
  { key: 'users', label: 'Utilisateurs Totaux', value: '42 850', icon: 'group', iconBg: 'bg-primary/10', iconColor: colors.primary, trend: '+12%' },
  { key: 'revenue', label: 'Revenus Mensuels', value: '2.4M FCFA', icon: 'payments', iconBg: 'bg-secondary/10', iconColor: colors.secondary, trend: '+8.4%' },
  { key: 'jobs', label: 'Offres Actives', value: '1 124', icon: 'work', iconBg: 'bg-tertiary/10', iconColor: colors.tertiary },
];

const WEEKLY = [
  { day: 'Lun', value: 40 },
  { day: 'Mar', value: 65 },
  { day: 'Mer', value: 55 },
  { day: 'Jeu', value: 90 },
  { day: 'Ven', value: 75 },
  { day: 'Sam', value: 35 },
  { day: 'Dim', value: 20 },
];
const MAX_WEEKLY = Math.max(...WEEKLY.map((d) => d.value));

const ALERTS = [
  {
    id: '1',
    title: 'Tentative de Phishing - "BGC Cameroon"',
    body: "L'entreprise demande des frais de dossier de 15 000 FCFA via Orange Money. 12 signalements candidats.",
    timeAgo: 'Il y a 22 min',
  },
  {
    id: '2',
    title: 'Offre dupliquée détectée',
    body: 'Le même poste a été publié par 3 comptes recruteurs différents en 1h.',
    timeAgo: 'Il y a 1h',
  },
];

export default function TableauDeBordAdminScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminTabParamList>>();
  const stackNavigation = navigation.getParent<NativeStackNavigationProp<AdminStackParamList>>();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 24 }}>
        <View className="gap-1">
          <Text className="font-sans-bold text-headline-lg text-on-surface">Bonjour, Admin Principal</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">
            Voici l'état actuel de la plateforme EmploiCamer.
          </Text>
        </View>

        {/* Stats */}
        <View className="gap-md">
          {STATS.map((stat) => (
            <View key={stat.key} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className={`h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <MaterialIcons name={stat.icon} size={20} color={stat.iconColor} />
                </View>
                {stat.trend && (
                  <View className="rounded-full bg-secondary-container/20 px-2 py-0.5">
                    <Text className="font-sans-semibold text-[10px] text-secondary">{stat.trend}</Text>
                  </View>
                )}
              </View>
              <Text className="font-sans text-label-md text-on-surface-variant">{stat.label}</Text>
              <Text className="font-sans-bold text-display-lg text-on-surface">{stat.value}</Text>
            </View>
          ))}

          {/* Security alerts stat - highlighted */}
          <View className="gap-2 rounded-xl border border-error/20 bg-error-container/10 p-lg">
            <View className="flex-row items-center justify-between">
              <View className="h-10 w-10 items-center justify-center rounded-lg bg-error/10">
                <MaterialIcons name="security" size={20} color={colors.error} />
              </View>
              <View className="rounded-full bg-error px-2 py-0.5">
                <Text className="font-sans-bold text-[10px] text-white">URGENT</Text>
              </View>
            </View>
            <Text className="font-sans text-label-md text-error">Alertes de Sécurité</Text>
            <Text className="font-sans-bold text-display-lg text-error">14</Text>
            <Text className="font-sans-semibold text-xs uppercase tracking-wider text-error">
              Actions immédiates requises
            </Text>
          </View>
        </View>

        {/* Weekly chart */}
        <View className="gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Croissance Hebdomadaire</Text>
          <View className="h-40 flex-row items-end justify-between gap-2">
            {WEEKLY.map((d) => (
              <View key={d.day} className="flex-1 items-center gap-2">
                <View
                  className="w-full rounded-t-lg bg-primary/70"
                  style={{ height: `${(d.value / MAX_WEEKLY) * 100}%` }}
                />
                <Text className="font-sans text-label-md text-on-surface-variant">{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Finance & Compliance quick access */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-headline-md text-on-surface">Finance & Conformité</Text>
          <View className="flex-row gap-md">
            <Pressable
              onPress={() => stackNavigation?.navigate('DashboardPaiements')}
              className="flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MaterialIcons name="payments" size={20} color={colors.primary} />
              </View>
              <Text className="font-sans-semibold text-label-lg text-on-surface">Paiements</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">Revenus, transactions</Text>
            </Pressable>
            <Pressable
              onPress={() => stackNavigation?.navigate('TableauDeBordConformite')}
              className="flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <MaterialIcons name="shield" size={20} color={colors.secondary} />
              </View>
              <Text className="font-sans-semibold text-label-lg text-on-surface">Conformité</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">Risques, KYC</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => stackNavigation?.navigate('JournalAudit')}
            className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-tertiary/10">
              <MaterialIcons name="history-edu" size={20} color={colors.tertiary} />
            </View>
            <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Journal d'audit</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
          </Pressable>
          <Pressable
            onPress={() => stackNavigation?.navigate('DashboardMarketing')}
            className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MaterialIcons name="campaign" size={20} color={colors.primary} />
            </View>
            <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Performance Marketing</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
          </Pressable>
          <Pressable
            onPress={() => stackNavigation?.navigate('GestionAccesRH')}
            className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
              <MaterialIcons name="manage-accounts" size={20} color={colors.secondary} />
            </View>
            <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Équipe & Accès</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
          </Pressable>
          <Pressable
            onPress={() => stackNavigation?.navigate('RapportSecuriteMensuel')}
            className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-error/10">
              <MaterialIcons name="shield-moon" size={20} color={colors.error} />
            </View>
            <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Rapport de Sécurité</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
          </Pressable>
        </View>

        {/* More tools */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-headline-md text-on-surface">Plus d'outils</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: 'Campagnes SMS/Email', icon: 'sms' as const, screen: 'GestionCampagnesSMSEmail' },
              { label: "Équipes d'agents", icon: 'supervisor-account' as const, screen: 'GestionEquipesAgents' },
              { label: 'Supervision', icon: 'monitor-heart' as const, screen: 'TableauDeBordSupervision' },
              { label: 'Offres frauduleuses', icon: 'gpp-bad' as const, screen: 'ModerationOffresFrauduleuses' },
              { label: 'Audit financier', icon: 'account-balance' as const, screen: 'JournalAuditFinancier' },
              { label: 'FAQ Sécurité', icon: 'help' as const, screen: 'FaqSecurite' },
              { label: 'Codes de remise', icon: 'local-offer' as const, screen: 'GestionRemises' },
            ].map((tool) => (
              <Pressable
                key={tool.label}
                onPress={() => stackNavigation?.navigate(tool.screen as any)}
                className="min-w-[47%] flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
              >
                <MaterialIcons name={tool.icon} size={22} color={colors.primary} />
                <Text className="text-center font-sans-semibold text-label-md text-on-surface">{tool.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Critical alerts */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <Text className="font-sans-semibold text-headline-md text-on-surface">Alertes Critiques</Text>
            <View className="rounded-full bg-error px-2 py-0.5">
              <Text className="text-[10px] font-sans-bold text-white">2 NOUVELLES</Text>
            </View>
          </View>
          <View className="gap-md">
            {ALERTS.map((alert) => (
              <Pressable
                key={alert.id}
                onPress={() => navigation.navigate('ModerationLitiges')}
                className="gap-2 rounded-xl border-l-4 border-error bg-surface-container-lowest p-md shadow-sm"
              >
                <View className="flex-row items-start gap-md">
                  <View className="h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high">
                    <MaterialIcons name="report-problem" size={20} color={colors.error} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-title-lg text-on-surface">{alert.title}</Text>
                    <Text className="mt-1 font-sans text-body-md text-on-surface-variant">{alert.body}</Text>
                    <Text className="mt-2 font-sans text-label-md text-outline">{alert.timeAgo}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
