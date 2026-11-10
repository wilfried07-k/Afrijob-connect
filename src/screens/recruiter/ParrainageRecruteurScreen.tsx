import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getMyReferrals, type ReferralSummary } from '../../lib/api';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

export default function ParrainageRecruteurScreen({ navigation }: Props) {
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setSummary(await getMyReferrals()); }
    catch (err) { setError((err as Error).message || 'Impossible de charger les parrainages.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const shareCode = async () => {
    if (!summary) return;
    try { await Share.share({ message: 'Rejoins EmploiCamer et saisis mon code de parrainage ' + summary.code + ' lors de ton inscription.' }); }
    catch (err) { Alert.alert('Partage indisponible', (err as Error).message || 'Impossible de partager le code.'); }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Parrainage entreprise</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        <View className="items-center gap-md rounded-2xl bg-primary p-lg">
          <MaterialIcons name="handshake" size={34} color="#fff" />
          <Text className="text-center font-sans-bold text-headline-md text-white">Inviter une entreprise ou un candidat</Text>
          <Text className="text-center font-sans text-body-md text-white/85">Les nouvelles inscriptions utilisant ton code seront comptabilisées ici.</Text>
          {loading ? <ActivityIndicator color="#fff" /> : error ? <Text className="font-sans text-label-lg text-white">{error}</Text> : <Text className="rounded-lg bg-white/15 px-lg py-3 font-sans-bold text-title-lg text-white">{summary?.code}</Text>}
          <Pressable disabled={!summary} onPress={() => void shareCode()} className="w-full flex-row items-center justify-center gap-2 rounded-lg bg-white py-3">
            <MaterialIcons name="share" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Partager le code</Text>
          </Pressable>
        </View>
        <View className="items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
          <Text className="font-sans-bold text-display-lg text-primary">{summary?.total_signups ?? 0}</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">Inscriptions attribuées à ce code</Text>
        </View>
        <Text className="font-sans-semibold text-title-lg text-on-surface">Inscriptions récentes</Text>
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? <Text className="font-sans text-body-md text-error">{error}</Text> : summary?.signups.length ? summary.signups.map((item, index) => (
          <View key={item.created_at + index} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
            <MaterialIcons name={item.account_type === 'recruiter' ? 'business' : 'person'} size={22} color={colors.primary} />
            <View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{item.account_type === 'recruiter' ? 'Entreprise inscrite' : 'Candidat inscrit'}</Text><Text className="font-sans text-label-md text-on-surface-variant">{new Date(item.created_at).toLocaleDateString('fr-FR')}</Text></View>
          </View>
        )) : <Text className="rounded-lg bg-surface-container p-md font-sans text-body-md text-on-surface-variant">Aucune inscription liée pour le moment.</Text>}
        <Text className="text-center font-sans text-label-md text-on-surface-variant">Aucune commission ou prime financière n’est configurée.</Text>
        <Pressable onPress={() => void load()} className="flex-row items-center justify-center gap-2 p-md"><MaterialIcons name="refresh" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Actualiser</Text></Pressable>
      </ScrollView>
    </View>
  );
}