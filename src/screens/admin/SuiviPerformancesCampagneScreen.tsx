import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { getMarketingCampaign, type MarketingCampaign } from '../../lib/api';

type Props = { navigation: { goBack: () => void }; route: { params: { campaignId: number; campaignName: string } } };
export default function SuiviPerformancesCampagneScreen({ navigation, route }: Props) {
  const [campaign, setCampaign] = useState<MarketingCampaign | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; getMarketingCampaign(route.params.campaignId).then((item) => { if (active) setCampaign(item); }).catch((err: unknown) => { if (active) setError((err as Error).message || 'Impossible de charger la campagne.'); }); return () => { active = false; }; }, [route.params.campaignId]);
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary" numberOfLines={1}>{campaign?.name || route.params.campaignName}</Text></View>
      {campaign ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg"><Text className="font-sans text-label-lg text-on-surface-variant">État</Text><Text className="font-sans-bold text-headline-md text-primary">{campaign.status}</Text><Text className="font-sans text-body-md text-on-surface-variant">Canal : {campaign.channel}</Text></View>
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg"><MaterialIcons name="groups" size={22} color={colors.primary} /><Text className="font-sans text-label-md text-on-surface-variant">Audience estimée au dernier enregistrement</Text><Text className="font-sans-bold text-display-lg text-on-surface">{campaign.audience_size.toLocaleString('fr-FR')}</Text><Text className="font-sans text-label-md text-on-surface-variant">Segment : {campaign.audience_segment}</Text></View>
        <View className="flex-row items-start gap-3 rounded-xl border border-tertiary/30 bg-tertiary/5 p-md"><MaterialIcons name="info-outline" size={20} color={colors.primary} /><Text className="flex-1 font-sans text-body-md text-on-surface-variant">Aucune donnée d’envoi, d’ouverture, de clic ou de conversion n’est disponible : aucun fournisseur de diffusion n’est connecté. Le nombre ci-dessus est une estimation de comptes, pas un nombre de destinataires contactés.</Text></View>
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg"><Text className="font-sans-semibold text-title-lg text-on-surface">Message préparé</Text><Text className="font-sans text-body-md text-on-surface-variant">{campaign.content}</Text></View>
      </ScrollView> : <View className="flex-1 items-center justify-center px-6">{error ? <Text className="font-sans text-body-md text-error">{error}</Text> : <ActivityIndicator color={colors.primary} />}</View>}
    </View>
  );
}