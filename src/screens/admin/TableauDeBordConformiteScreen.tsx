import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import { getAdminDashboardSummary, listPendingKyc, type AdminDashboardSummary, type CompanyInfo } from '../../lib/api';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'TableauDeBordConformite'>;
const QUICK_LINKS: { icon: keyof typeof MaterialIcons.glyphMap; label: string; screen: 'DashboardPaiements' | 'GestionRemboursements' | 'JournalAudit' }[] = [
  { icon: 'payments', label: 'Paiements', screen: 'DashboardPaiements' },
  { icon: 'assignment-return', label: 'Remboursements', screen: 'GestionRemboursements' },
  { icon: 'history-edu', label: "Journal d'audit", screen: 'JournalAudit' },
];
export default function TableauDeBordConformiteScreen({ navigation }: Props) {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [pending, setPending] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; Promise.all([getAdminDashboardSummary(), listPendingKyc()]).then(([stats, companies]) => { if (active) { setSummary(stats); setPending(companies.slice(0, 5)); } }).catch((err: unknown) => { if (active) setError((err as Error).message || 'Impossible de charger les données de conformité.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const compliance = summary?.companies ? Math.round((summary.verified_companies / summary.companies) * 100) : 0;
  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><View className="flex-row items-center gap-2"><MaterialIcons name="shield" size={20} color={colors.primary} /><Text className="font-sans-bold text-headline-md text-primary">Conformité</Text></View></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}
        {loading && !summary ? <ActivityIndicator color={colors.primary} /> : summary ? <View className="flex-row flex-wrap gap-2">{[
          { label: 'Entreprises vérifiées', value: summary.verified_companies, icon: 'verified-user' as const, color: colors.secondary },
          { label: 'En attente KYC', value: summary.pending_kyc, icon: 'pending-actions' as const, color: colors.tertiary },
          { label: 'Taux vérifiées', value: `${compliance}%`, icon: 'assessment' as const, color: colors.primary },
        ].map((metric) => <View key={metric.label} className="min-w-[100px] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><MaterialIcons name={metric.icon} size={20} color={metric.color} /><Text className="font-sans text-[11px] text-on-surface-variant">{metric.label}</Text><Text className="font-sans-bold text-headline-md" style={{ color: metric.color }}>{typeof metric.value === 'number' ? metric.value.toLocaleString('fr-FR') : metric.value}</Text></View>)}</View> : null}
        <View className="gap-md"><Text className="font-sans-semibold text-title-lg text-on-surface">Accès rapide</Text><View className="flex-row flex-wrap gap-2">{QUICK_LINKS.map((link) => <Pressable key={link.label} onPress={() => navigation.navigate(link.screen)} className="min-w-[100px] flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><MaterialIcons name={link.icon} size={22} color={colors.primary} /><Text className="text-center font-sans-semibold text-label-md text-on-surface">{link.label}</Text></Pressable>)}</View></View>
        <View className="gap-md"><View className="flex-row items-center justify-between"><Text className="font-sans-semibold text-title-lg text-on-surface">Dossiers KYC non vérifiés</Text><Pressable onPress={() => navigation.navigate('AdminTabs', { screen: 'ModerationKYC' } as any)}><Text className="font-sans-semibold text-label-lg text-primary">Voir tout</Text></Pressable></View>{pending.length ? pending.map((company) => <Pressable key={company.id} onPress={() => navigation.navigate('AdminTabs', { screen: 'ModerationKYC' } as any)} className="flex-row items-center justify-between gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{company.name}</Text><Text className="font-sans text-label-md text-on-surface-variant">{company.sector || 'Secteur non renseigné'}</Text></View><Text className="rounded-full bg-tertiary/10 px-2 py-1 text-[10px] font-sans-semibold text-tertiary">{company.review_status || 'En attente'}</Text></Pressable>) : !loading ? <Text className="font-sans text-body-md text-on-surface-variant">Aucune entreprise à vérifier.</Text> : null}</View>
      </ScrollView>
    </Screen>
  );
}