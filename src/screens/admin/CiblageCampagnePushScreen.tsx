import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { createMarketingCampaign, getMarketingCampaign, updateMarketingCampaignTarget, type CampaignChannel, type CampaignSegment } from '../../lib/api';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void }; route?: { params?: { campaignId?: number; campaignName?: string } } };
const CHANNELS: CampaignChannel[] = ['SMS', 'Email', 'Push'];
const SEGMENTS: { key: CampaignSegment; label: string }[] = [
  { key: 'candidates', label: 'Tous les candidats' },
  { key: 'recruiters', label: 'Tous les recruteurs' },
  { key: 'all', label: 'Candidats et recruteurs' },
  { key: 'premium', label: 'Abonnements Premium actifs' },
];
export default function CiblageCampagnePushScreen({ navigation, route }: Props) {
  const campaignId = route?.params?.campaignId;
  const [name, setName] = useState(route?.params?.campaignName || '');
  const [channel, setChannel] = useState<CampaignChannel>('Push');
  const [segment, setSegment] = useState<CampaignSegment>('candidates');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(Boolean(campaignId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (!campaignId) return; let active = true; getMarketingCampaign(campaignId).then((campaign) => { if (active) { setName(campaign.name); setChannel(campaign.channel); setSegment(campaign.audience_segment); setContent(campaign.content); } }).catch((err: unknown) => { if (active) setError((err as Error).message || 'Campagne introuvable.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [campaignId]);
  const save = async () => {
    if (name.trim().length < 3 || content.trim().length < 10) { Alert.alert('Complète la campagne', 'Le nom doit contenir au moins 3 caractères et le message 10 caractères.'); return; }
    setSaving(true);
    try {
      const campaign = campaignId ? await updateMarketingCampaignTarget(campaignId, { name: name.trim(), channel, content: content.trim(), audience_segment: segment, prepared: true }) : await createMarketingCampaign({ name: name.trim(), channel, content: content.trim(), audience_segment: segment }).then((created) => updateMarketingCampaignTarget(created.id, { name: name.trim(), channel, content: content.trim(), audience_segment: segment, prepared: true }));
      navigation.navigate('ConfirmationEnvoiCampagne', { campaignId: campaign.id, campaignName: campaign.name });
    } catch (err) { Alert.alert('Campagne non enregistrée', (err as Error).message || 'Réessaie plus tard.'); }
    finally { setSaving(false); }
  };
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Préparer une campagne</Text></View>
      {loading ? <ActivityIndicator className="mt-10" color={colors.primary} /> : <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        {error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}
        <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface">Nom de campagne</Text><TextInput value={name} onChangeText={setName} placeholder="Ex. Information de service" className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-on-surface" /></View>
        <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface">Canal</Text><View className="flex-row gap-2">{CHANNELS.map((item) => <Pressable key={item} onPress={() => setChannel(item)} className={`flex-1 items-center rounded-lg border p-3 ${channel === item ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest'}`}><Text className={`font-sans-semibold text-label-md ${channel === item ? 'text-primary' : 'text-on-surface'}`}>{item}</Text></Pressable>)}</View></View>
        <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface">Contenu</Text><TextInput value={content} onChangeText={setContent} multiline numberOfLines={5} textAlignVertical="top" placeholder="Saisis le message qui sera diffusé après configuration d’un fournisseur." maxLength={4000} className="min-h-[130px] rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-on-surface" /><Text className="text-right font-sans text-label-md text-on-surface-variant">{content.length}/4000</Text></View>
        <View className="gap-2"><Text className="font-sans-semibold text-title-lg text-on-surface">Audience estimée par le backend</Text>{SEGMENTS.map((item) => <Pressable key={item.key} onPress={() => setSegment(item.key)} className={`flex-row items-center justify-between rounded-xl border-2 p-md ${segment === item.key ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface-container-lowest'}`}><Text className={`font-sans-medium text-label-lg ${segment === item.key ? 'text-primary' : 'text-on-surface'}`}>{item.label}</Text>{segment === item.key && <MaterialIcons name="check-circle" size={20} color={colors.primary} />}</Pressable>)}</View>
        <View className="flex-row items-start gap-3 rounded-xl border border-tertiary/30 bg-tertiary/5 p-md"><MaterialIcons name="info-outline" size={20} color={colors.primary} /><Text className="flex-1 font-sans text-body-md text-on-surface-variant">Cette action enregistre et prépare le brouillon. Elle n’envoie aucun SMS, e-mail ou push ; un fournisseur de diffusion doit d’abord être configuré.</Text></View>
        <Pressable disabled={saving || !!error} onPress={save} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary">{saving ? <ActivityIndicator color="#ffffff" /> : <><MaterialIcons name="save" size={18} color="#ffffff" /><Text className="font-sans-semibold text-title-lg text-on-primary">Enregistrer la campagne</Text></>}</Pressable>
      </ScrollView>}
    </View>
  );
}