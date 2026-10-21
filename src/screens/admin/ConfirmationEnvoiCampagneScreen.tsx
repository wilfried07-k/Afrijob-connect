import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { getMarketingCampaign, type MarketingCampaign } from '../../lib/api';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void }; route: { params: { campaignId: number; campaignName: string } } };
export default function ConfirmationEnvoiCampagneScreen({ navigation, route }: Props) {
  const { campaignId, campaignName } = route.params;
  const [campaign, setCampaign] = useState<MarketingCampaign | null>(null);
  useEffect(() => { let active = true; getMarketingCampaign(campaignId).then((item) => { if (active) setCampaign(item); }).catch(() => {}); return () => { active = false; }; }, [campaignId]);
  return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className="h-28 w-28 items-center justify-center rounded-full bg-primary-container/20"><MaterialIcons name="save" size={52} color={colors.primary} /></View>
      <View className="items-center gap-2"><Text className="font-sans-bold text-headline-lg text-on-surface">Campagne enregistrée</Text><Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant"><Text className="font-sans-bold text-on-surface">{campaign?.name || campaignName}</Text> est conservée dans les brouillons. Elle n’a été envoyée à personne.</Text></View>
      <View className="w-full gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><Text className="font-sans-semibold text-title-lg text-on-surface">État : {campaign?.status || 'chargement…'}</Text><Text className="font-sans text-body-md text-on-surface-variant">Audience estimée : {campaign ? `${campaign.audience_size.toLocaleString('fr-FR')} comptes` : '—'}</Text><Text className="font-sans text-body-md text-on-surface-variant">L’envoi et le suivi des ouvertures/clics nécessitent un fournisseur SMS, e-mail ou push configuré.</Text></View>
      <Pressable onPress={() => navigation.navigate('SuiviPerformancesCampagne', { campaignId, campaignName: campaign?.name || campaignName })} className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"><MaterialIcons name="bar-chart" size={18} color="#ffffff" /><Text className="font-sans-semibold text-title-lg text-on-primary">Voir l’état de la campagne</Text></Pressable>
      <Pressable onPress={() => navigation.navigate('GestionCampagnesSMSEmail')}><Text className="font-sans-semibold text-label-lg text-primary">Retour aux campagnes</Text></Pressable>
    </View>
  );
}