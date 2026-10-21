import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { getCnpsAdminSummary, type CnpsAdminSummary } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };
export default function TableauDeBordCNPSScreen({ navigation }: Props) {
  const [summary, setSummary] = useState<CnpsAdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; getCnpsAdminSummary().then((data) => { if (active) setSummary(data); }).catch((err: unknown) => { if (active) setError((err as Error).message || 'Impossible de charger les données DIPE.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const compliance = summary?.companies_total ? Math.round((summary.companies_verified / summary.companies_total) * 100) : 0;
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><View className="flex-row items-center gap-2"><MaterialIcons name="account-balance" size={20} color={colors.primary} /><Text className="font-sans-bold text-headline-md text-primary">DIPE & conformité</Text></View></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <Text className="font-sans text-body-md text-on-surface-variant">Indicateurs calculés à partir des déclarations conservées dans l’application. Ils ne représentent pas des transmissions ni des paiements confirmés par la CNPS.</Text>
        {error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}
        {loading ? <ActivityIndicator color={colors.primary} /> : summary ? <View className="flex-row flex-wrap gap-2">{[
          { label: 'Déclarations DIPE enregistrées', value: summary.dipe_declarations_total, icon: 'fact-check' as const, color: colors.primary },
          { label: 'À transmettre à la CNPS', value: summary.dipe_pending_transmission, icon: 'pending-actions' as const, color: colors.tertiary },
          { label: 'Entreprises vérifiées', value: summary.companies_verified, icon: 'verified-user' as const, color: colors.secondary },
          { label: 'Taux de vérification KYC', value: `${compliance}%`, icon: 'assessment' as const, color: colors.primary },
        ].map((metric) => <View key={metric.label} className="min-w-[47%] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><MaterialIcons name={metric.icon} size={20} color={metric.color} /><Text className="font-sans text-[11px] text-on-surface-variant">{metric.label}</Text><Text className="font-sans-bold text-headline-md" style={{ color: metric.color }}>{typeof metric.value === 'number' ? metric.value.toLocaleString('fr-FR') : metric.value}</Text></View>)}</View> : null}
        <View className="flex-row items-start gap-3 rounded-xl border border-tertiary/30 bg-tertiary/5 p-md"><MaterialIcons name="info-outline" size={20} color={colors.primary} /><Text className="flex-1 font-sans text-body-md text-on-surface-variant">La plateforme enregistre les déclarations DIPE localement. La transmission officielle, le suivi des cotisations versées et la ventilation par région nécessitent une intégration ou un partenariat CNPS ; aucune donnée de paiement n’est disponible ici.</Text></View>
      </ScrollView>
    </View>
  );
}