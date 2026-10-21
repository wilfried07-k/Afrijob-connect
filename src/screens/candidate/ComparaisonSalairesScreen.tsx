import { useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';
import { getJobs, type JobOffer } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };
const CITIES = [
  { label: 'Douala', value: 'douala' }, { label: 'Yaoundé', value: 'yaounde' },
  { label: 'Garoua', value: 'garoua' }, { label: 'Bafoussam', value: 'bafoussam' },
];

const money = (value: number) => new Intl.NumberFormat('fr-FR').format(Math.round(value)) + ' FCFA';

export default function ComparaisonSalairesScreen({ navigation }: Props) {
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!jobTitle.trim()) { setError('Saisis un intitulé de poste.'); return; }
    setLoading(true); setError(''); setHasSearched(true);
    try {
      const results = await getJobs({ keyword: jobTitle.trim(), city: city || undefined });
      setOffers(results.filter((offer) => (offer.salary_min ?? 0) > 0 || (offer.salary_max ?? 0) > 0));
    } catch (err) {
      setError((err as Error).message || 'Impossible de charger les offres.');
      setOffers([]);
    } finally { setLoading(false); }
  };

  const amounts = offers.map((offer) => {
    if (offer.salary_min && offer.salary_max) return (offer.salary_min + offer.salary_max) / 2;
    return offer.salary_min || offer.salary_max || 0;
  }).filter((value) => value > 0);
  const min = amounts.length ? Math.min(...amounts) : 0;
  const max = amounts.length ? Math.max(...amounts) : 0;
  const average = amounts.length ? amounts.reduce((sum, value) => sum + value, 0) / amounts.length : 0;
  const band = max > min ? (average - min) / (max - min) * 100 : 50;

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Comparer les salaires</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="gap-1"><Text className="font-sans-medium text-label-lg text-on-surface-variant">Intitulé du poste</Text><View className="h-12 flex-row items-center rounded-xl border border-outline-variant bg-surface px-md"><MaterialIcons name="search" size={18} color={colors.outline} /><TextInput value={jobTitle} onChangeText={setJobTitle} placeholder="Ex. Développeur Fullstack" className="ml-2 flex-1 font-sans text-body-md text-on-surface" /></View></View>
          <View className="gap-1"><Text className="font-sans-medium text-label-lg text-on-surface-variant">Localisation</Text><SelectField icon="location-on" placeholder="Toutes les villes" options={[{ label: 'Toutes les villes', value: '' }, ...CITIES]} value={city} onChange={setCity} /></View>
          <Pressable disabled={loading} onPress={() => void search()} className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary">{loading ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="search" size={18} color="#fff" /><Text className="font-sans-semibold text-label-lg text-on-primary">Comparer les offres</Text></>}</Pressable>
        </View>
        {error ? <Text className="font-sans text-body-md text-error">{error}</Text> : null}
        {hasSearched && !loading && amounts.length > 0 && <View className="gap-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between"><Text className="font-sans-semibold text-title-lg text-on-surface">Salaires affichés (FCFA)</Text><Text className="font-sans text-label-md text-on-surface-variant">{amounts.length} offre{amounts.length > 1 ? 's' : ''}</Text></View>
          <View className="gap-2"><View className="h-3 w-full overflow-hidden rounded-full bg-surface-variant"><View className="h-full rounded-full bg-primary" style={{ width: `${band}%` as any }} /></View><View className="flex-row justify-between"><Text className="font-sans text-label-md text-on-surface-variant">Min. {money(min)}</Text><View className="items-center"><Text className="font-sans-bold text-label-lg text-primary">{money(average)}</Text><Text className="text-[10px] uppercase tracking-wider text-primary">Moyenne indicative</Text></View><Text className="font-sans text-label-md text-on-surface-variant">Max. {money(max)}</Text></View></View>
          <Text className="font-sans text-label-md text-on-surface-variant">Calcul établi uniquement à partir des rémunérations publiées dans les offres correspondantes, pas d’une enquête salariale représentative.</Text>
        </View>}
        {hasSearched && !loading && offers.length === 0 && <View className="items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg"><MaterialIcons name="query-stats" size={36} color={colors.outline} /><Text className="text-center font-sans text-body-md text-on-surface-variant">Aucune offre correspondante avec un salaire renseigné. Modifie ta recherche ou réessaie plus tard.</Text></View>}
        {hasSearched && offers.length > 0 && <View className="gap-md"><Text className="font-sans-semibold text-title-lg text-on-surface">Offres utilisées pour le calcul</Text>{offers.map((offer) => <View key={offer.id} className="gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><Text className="font-sans-semibold text-label-lg text-on-surface">{offer.title}</Text><Text className="font-sans text-label-md text-on-surface-variant">{offer.company_name || 'Entreprise'} · {offer.city || 'Ville non précisée'}</Text><Text className="font-sans-semibold text-label-md text-primary">{offer.salary_min && offer.salary_max ? money(offer.salary_min) + ' – ' + money(offer.salary_max) : money(offer.salary_min || offer.salary_max || 0)}</Text></View>)}</View>}
      </ScrollView>
    </Screen>
  );
}
