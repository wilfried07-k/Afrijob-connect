import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import { getMarketingSummary, listMarketingCampaigns, type MarketingCampaign, type MarketingSummary } from '../../lib/api';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AdminStackParamList, 'DashboardMarketing'>;
export default function DashboardMarketingScreen({ navigation }: Props) {
  const [summary, setSummary] = useState<MarketingSummary | null>(null);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => { setLoading(true); try { const [stats, items] = await Promise.all([getMarketingSummary(), listMarketingCampaigns()]); setSummary(stats); setCampaigns(items.slice(0, 5)); setError(''); } catch (err) { setError((err as Error).message || 'Impossible de charger les données marketing.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Marketing</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between"><Text className="font-sans-bold text-headline-lg text-on-surface">Données du compte</Text><Pressable onPress={refresh} hitSlop={8}><MaterialIcons name="refresh" size={22} color={colors.primary} /></Pressable></View>
        {error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}
        {loading && !summary ? <ActivityIndicator color={colors.primary} /> : summary ? <View className="flex-row flex-wrap gap-2">{[
          { label: 'Comptes candidats', value: summary.candidate_accounts },
          { label: 'Comptes recruteurs', value: summary.recruiter_accounts },
          { label: 'Campagnes enregistrées', value: summary.campaigns_total },
          { label: 'Prêtes, non envoyées', value: summary.campaigns_prepared },
        ].map((metric) => <View key={metric.label} className="min-w-[47%] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><MaterialIcons name="insights" size={20} color={colors.primary} /><Text className="font-sans text-[11px] text-on-surface-variant">{metric.label}</Text><Text className="font-sans-bold text-headline-md text-on-surface">{metric.value.toLocaleString('fr-FR')}</Text></View>)}</View> : null}
        <View className="gap-md"><View className="flex-row items-center justify-between"><Text className="font-sans-semibold text-title-lg text-on-surface">Campagnes enregistrées</Text><Pressable onPress={() => navigation.navigate('GestionCampagnesSMSEmail')}><Text className="font-sans-semibold text-label-lg text-primary">Tout voir</Text></Pressable></View>
          {campaigns.length ? campaigns.map((campaign) => <Pressable key={campaign.id} onPress={() => navigation.navigate('CiblageCampagnePush', { campaignId: campaign.id, campaignName: campaign.name })} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><View className="flex-row items-center justify-between"><Text className="font-sans-semibold text-label-lg text-on-surface">{campaign.name}</Text><Text className="font-sans-semibold text-label-md text-primary">{campaign.status}</Text></View><Text className="font-sans text-label-md text-on-surface-variant">{campaign.channel} · {campaign.audience_size.toLocaleString('fr-FR')} comptes estimés</Text></Pressable>) : !loading ? <Text className="font-sans text-body-md text-on-surface-variant">Aucune campagne enregistrée.</Text> : null}
        </View>
        <View className="flex-row items-start gap-3 rounded-xl border border-tertiary/30 bg-tertiary/5 p-md"><MaterialIcons name="info-outline" size={20} color={colors.primary} /><Text className="flex-1 font-sans text-body-md text-on-surface-variant">Les ouvertures, clics, conversions, acquisitions et utilisateurs actifs mensuels ne sont pas suivis actuellement. Aucun chiffre de diffusion n’est présenté tant qu’un fournisseur et un suivi d’événements ne sont pas intégrés.</Text></View>
        <Pressable onPress={() => navigation.navigate('GestionCampagnesSMSEmail')} className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-primary"><MaterialIcons name="campaign" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Gérer les campagnes</Text></Pressable>
      </ScrollView>
    </Screen>
  );
}