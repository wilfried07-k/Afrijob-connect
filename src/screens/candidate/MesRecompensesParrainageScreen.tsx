import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getMyReferrals, type ReferralSummary } from '../../lib/api';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

export default function MesRecompensesParrainageScreen({ navigation }: Props) {
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setSummary(await getMyReferrals()); }
    catch (err) { setError((err as Error).message || 'Impossible de charger les inscriptions.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Suivi du parrainage</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 32 }}>
        <View className="gap-2 rounded-2xl bg-primary p-lg">
          <Text className="font-sans text-label-lg text-white/80">Code de parrainage</Text>
          <Text className="font-sans-extrabold text-headline-lg text-white">{summary?.code ?? '—'}</Text>
          <Text className="font-sans text-body-md text-white/85">{summary?.total_signups ?? 0} inscription(s) attribuée(s)</Text>
        </View>
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? <Text className="font-sans text-body-md text-error">{error}</Text> : summary?.signups.length ? summary.signups.map((item, index) => (
          <View key={item.created_at + index} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
            <MaterialIcons name={item.account_type === 'recruiter' ? 'business' : 'person'} size={22} color={colors.primary} />
            <View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{item.account_type === 'recruiter' ? 'Recruteur inscrit' : 'Candidat inscrit'}</Text><Text className="font-sans text-label-md text-on-surface-variant">{new Date(item.created_at).toLocaleString('fr-FR')}</Text></View>
            <MaterialIcons name="check-circle" size={18} color={colors.secondary} />
          </View>
        )) : <Text className="rounded-lg bg-surface-container p-md font-sans text-body-md text-on-surface-variant">Aucune inscription liée à ce code.</Text>}
        <Text className="text-center font-sans text-label-md text-on-surface-variant">Le suivi des inscriptions fonctionne. Les primes et retraits ne sont pas proposés.</Text>
        <Pressable onPress={() => void load()} className="flex-row items-center justify-center gap-2 p-md"><MaterialIcons name="refresh" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Actualiser</Text></Pressable>
      </ScrollView>
    </View>
  );
}