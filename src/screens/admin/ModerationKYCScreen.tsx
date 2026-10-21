import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { listPendingKyc, reviewKycCompany, type CompanyInfo } from '../../lib/api';

type Filter = 'Tous les dossiers' | 'Compléments requis';
const FILTERS: Filter[] = ['Tous les dossiers', 'Compléments requis'];
export default function ModerationKYCScreen() {
  const [filter, setFilter] = useState<Filter>(FILTERS[0]);
  const [files, setFiles] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => { setLoading(true); try { setFiles(await listPendingKyc()); setError(''); } catch (err) { setError((err as Error).message || 'Impossible de charger la file KYC.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const approveCompany = async (companyId: number) => {
    setBusyId(companyId);
    try { await reviewKycCompany(companyId, true); setFiles((list) => list.filter((file) => file.id !== companyId)); }
    catch (err) { Alert.alert('Validation impossible', (err as Error).message || 'Réessaie plus tard.'); }
    finally { setBusyId(null); }
  };
  const requestMoreInfo = async (companyId: number) => {
    setBusyId(companyId);
    try {
      await reviewKycCompany(companyId, false);
      setFiles((list) => list.map((file) => file.id === companyId ? { ...file, review_status: 'Compléments requis' } : file));
      Alert.alert('État enregistré', 'Le dossier est marqué « Compléments requis ». Aucune notification automatique n’est envoyée à l’entreprise.');
    } catch (err) { Alert.alert('Mise à jour impossible', (err as Error).message || 'Réessaie plus tard.'); }
    finally { setBusyId(null); }
  };
  const neededCount = files.filter((file) => file.review_status === 'Compléments requis').length;
  const filteredFiles = filter === 'Compléments requis' ? files.filter((file) => file.review_status === 'Compléments requis') : files;
  return (
    <Screen>
      <View className="gap-1 px-container-margin pb-md pt-md"><Text className="font-sans-bold text-headline-lg text-on-surface">Vérification KYC</Text><Text className="font-sans text-body-md text-on-surface-variant">Entreprises non vérifiées enregistrées dans la base.</Text></View>
      {loading && !files.length ? <View className="items-center justify-center py-20"><ActivityIndicator size="large" color={colors.primary} /></View> : <FlatList data={filteredFiles} keyExtractor={(item) => String(item.id)} onRefresh={refresh} refreshing={loading} contentContainerStyle={{ padding: 20, gap: 12 }} ListHeaderComponent={<View className="mb-md gap-md"><View className="flex-row flex-wrap gap-2">{[{ label: 'À examiner', value: String(files.length), icon: 'pending-actions' as const, color: colors.primary }, { label: 'Compléments requis', value: String(neededCount), icon: 'info-outline' as const, color: colors.tertiary }].map((item) => <View key={item.label} className="min-w-[100px] flex-1 flex-row items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><MaterialIcons name={item.icon} size={20} color={item.color} /><View><Text className="font-sans text-[10px] text-on-surface-variant">{item.label}</Text><Text className="font-sans-bold text-title-lg" style={{ color: item.color }}>{item.value}</Text></View></View>)}</View><View className="flex-row gap-2">{FILTERS.map((item) => <Pressable key={item} onPress={() => setFilter(item)} className={`rounded-full px-md py-2 ${filter === item ? 'bg-primary' : 'bg-surface-container-high'}`}><Text className={`font-sans-medium text-label-md ${filter === item ? 'text-on-primary' : 'text-on-surface-variant'}`}>{item}</Text></Pressable>)}</View>{error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}</View>} renderItem={({ item }) => <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"><View className="flex-row items-center gap-md"><View className="h-12 w-12 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low"><MaterialIcons name="apartment" size={22} color={colors.onSurfaceVariant} /></View><View className="flex-1"><Text className="font-sans-semibold text-title-lg text-on-surface">{item.name}</Text><Text className="font-sans text-label-md text-on-surface-variant">Secteur : {item.sector || 'Non précisé'}</Text><Text className="font-sans text-label-md text-on-surface-variant">Matricule employeur : {item.cnps_employer_matricule || 'Non renseigné'}</Text></View><Text className="rounded-full bg-tertiary/10 px-2 py-1 text-[10px] font-sans-semibold text-tertiary">{item.review_status || 'En attente'}</Text></View><Text className="font-sans text-body-md text-on-surface-variant">{item.description || 'Aucune description fournie'}</Text>{item.review_notes ? <Text className="font-sans text-label-md text-on-surface-variant">Note : {item.review_notes}</Text> : null}<View className="flex-row gap-2"><Pressable disabled={busyId === item.id} onPress={() => void approveCompany(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg bg-secondary opacity-100"><Text className="font-sans-semibold text-label-lg text-white">Approuver</Text></Pressable><Pressable disabled={busyId === item.id} onPress={() => void requestMoreInfo(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg border border-outline"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Marquer compléments requis</Text></Pressable></View></View>} ListEmptyComponent={<View className="items-center gap-md py-xl"><MaterialIcons name="verified-user" size={48} color={colors.secondary} /><Text className="font-sans text-body-md text-on-surface-variant">{error || (filter === 'Compléments requis' ? 'Aucun dossier en attente de compléments.' : 'Aucun dossier KYC en attente.')}</Text></View>} />}
    </Screen>
  );
}