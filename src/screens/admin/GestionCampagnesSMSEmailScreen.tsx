import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { listMarketingCampaigns, type MarketingCampaign } from '../../lib/api';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };
export default function GestionCampagnesSMSEmailScreen({ navigation }: Props) {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => { setLoading(true); try { setCampaigns(await listMarketingCampaigns()); setError(''); } catch (err) { setError((err as Error).message || 'Impossible de charger les campagnes.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin"><View className="flex-row items-center gap-3"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Campagnes</Text></View><Pressable onPress={() => navigation.navigate('CiblageCampagnePush')} className="h-10 w-10 items-center justify-center rounded-full bg-primary"><MaterialIcons name="add" size={20} color="#ffffff" /></Pressable></View>
      <FlatList data={campaigns} keyExtractor={(item) => String(item.id)} onRefresh={refresh} refreshing={loading} contentContainerStyle={{ padding: 20, gap: 12 }} ListEmptyComponent={!loading ? <Text className="py-8 text-center font-sans text-body-md text-on-surface-variant">{error || 'Aucune campagne. Crée un brouillon pour préparer une audience.'}</Text> : <ActivityIndicator color={colors.primary} />} renderItem={({ item }) => <Pressable onPress={() => navigation.navigate('CiblageCampagnePush', { campaignId: item.id, campaignName: item.name })} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><View className="flex-row items-center justify-between"><View className="flex-row items-center gap-2"><MaterialIcons name={item.channel === 'SMS' ? 'sms' : item.channel === 'Email' ? 'email' : 'notifications'} size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-on-surface">{item.name}</Text></View><Text className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-sans-bold text-primary">{item.status}</Text></View><Text className="font-sans text-label-md text-on-surface-variant">{item.channel} · {item.audience_size.toLocaleString('fr-FR')} destinataires estimés · {item.audience_segment}</Text></Pressable>} />
    </View>
  );
}