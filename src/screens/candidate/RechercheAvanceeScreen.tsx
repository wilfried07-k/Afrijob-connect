import { useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { getJobs, type JobOffer } from '../../lib/api';

const SECTORS = [
  { label: 'Tous les secteurs', value: '' },
  { label: 'Télécommunications', value: 'telecom' },
  { label: 'Banque & Finance', value: 'finance' },
  { label: 'BTP & Construction', value: 'btp' },
  { label: 'Technologie', value: 'tech' },
];

const CITIES = [
  { label: 'Cameroun (Toutes les villes)', value: '' },
  { label: 'Douala', value: 'douala' },
  { label: 'Yaoundé', value: 'yaounde' },
  { label: 'Bafoussam', value: 'bafoussam' },
  { label: 'Garoua', value: 'garoua' },
  { label: 'Bamenda', value: 'bamenda' },
];

const CONTRACT_TYPES = [
  { label: 'CDI', value: 'cdi' },
  { label: 'CDD', value: 'cdd' },
  { label: 'Stage', value: 'stage' },
  { label: 'Freelance', value: 'freelance' },
];

const formatCFA = (value: number) => `${new Intl.NumberFormat('fr-FR').format(Math.round(value))} FCFA +`;

export default function RechercheAvanceeScreen() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('');
  const [contracts, setContracts] = useState<string[]>(['cdi']);
  const [salary, setSalary] = useState(750000);
  const [results, setResults] = useState<JobOffer[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigation = useNavigation<any>();

  const searchJobs = async () => {
    setSearchLoading(true);
    setSearchError('');
    setHasSearched(true);
    try {
      const matches = await getJobs({
        keyword: query.trim() || undefined,
        city: city || undefined,
        contract_type: contracts.length ? contracts : undefined,
        sector: sector || undefined,
        minimum_salary: salary > 100000 ? salary : undefined,
      });
      setResults(matches);
      const searchLabel = query.trim();
      if (searchLabel) {
        setRecentSearches((current) => [searchLabel, ...current.filter((item) => item !== searchLabel)].slice(0, 5));
      }
    } catch (error) {
      setSearchError((error as Error).message || 'Impossible de charger les offres.');
      setResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleContract = (value: string) => {
    setContracts((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
  };

  return (
    <Screen>
      {/* Header / search bar */}
      <View className="flex-row items-center gap-md border-b border-outline-variant/20 px-container-margin py-md">
        <View className="h-12 flex-1 flex-row items-center rounded-md border border-outline-variant bg-surface-container-lowest px-md">
          <MaterialIcons name="search" size={20} color={colors.outline} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Poste, entreprise ou mot-clé"
            placeholderTextColor={colors.outline}
            className="ml-2 flex-1 font-sans text-body-md text-on-surface"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }} showsVerticalScrollIndicator={false}>
        {/* Searches recorded during this session */}
        <View className="gap-md">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Recherches récentes</Text>
            {recentSearches.length > 0 && (
              <Pressable onPress={() => setRecentSearches([])}>
                <Text className="font-sans-medium text-label-md text-primary">Effacer</Text>
              </Pressable>
            )}
          </View>
          {recentSearches.length === 0 ? (
            <Text className="font-sans text-label-md text-on-surface-variant">Vos recherches apparaîtront ici.</Text>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {recentSearches.map((search) => (
                <Pressable
                  key={search}
                  onPress={() => setQuery(search)}
                  className="flex-row items-center gap-1 rounded-full bg-surface-container px-md py-2"
                >
                  <MaterialIcons name="history" size={16} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-label-md text-on-surface-variant">{search}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>


        {/* Sector */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-outline">
            Secteur d'activité
          </Text>
          <SelectField placeholder="Tous les secteurs" options={SECTORS} value={sector} onChange={setSector} />
        </View>

        {/* Contract type */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-outline">
            Type de contrat
          </Text>
          <View className="flex-row flex-wrap gap-sm">
            {CONTRACT_TYPES.map((type) => {
              const active = contracts.includes(type.value);
              return (
                <Pressable
                  key={type.value}
                  onPress={() => toggleContract(type.value)}
                  className={`w-[47%] items-center justify-center rounded-lg border py-3 ${
                    active ? 'border-primary bg-primary-fixed' : 'border-outline-variant bg-surface-container-lowest'
                  }`}
                >
                  <Text className={`font-sans-semibold text-label-lg ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Location */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-outline">
            Localisation
          </Text>
          <SelectField icon="location-on" placeholder="Cameroun (Toutes les villes)" options={CITIES} value={city} onChange={setCity} />

</View>

        {/* Salary range */}
        <View className="gap-md">
          <View className="flex-row items-end justify-between">
            <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-outline">
              Fourchette salariale (FCFA)
            </Text>
            <Text className="font-sans-semibold text-title-lg text-primary">{formatCFA(salary)}</Text>
          </View>
          <Slider
            minimumValue={100000}
            maximumValue={2500000}
            step={50000}
            value={salary}
            onValueChange={setSalary}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.outlineVariant}
            thumbTintColor={colors.primary}
          />
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-md text-outline">100k</Text>
            <Text className="font-sans text-label-md text-outline">1M</Text>
            <Text className="font-sans text-label-md text-outline">2.5M+</Text>
          </View>
        </View>
        {hasSearched && (
          <View className="gap-md">
            <Text className="font-sans-semibold text-title-lg text-on-surface">
              {results.length} offre{results.length === 1 ? '' : 's'} trouvée{results.length === 1 ? '' : 's'}
            </Text>
            {searchError ? (
              <Text className="font-sans text-body-md text-error">{searchError}</Text>
            ) : results.length === 0 ? (
              <Text className="font-sans text-body-md text-on-surface-variant">
                Aucune offre ne correspond à ces filtres.
              </Text>
            ) : results.map((job) => (
              <Pressable
                key={job.id}
                onPress={() => navigation.getParent()?.navigate('DetailOffre', {
                  jobId: job.id,
                  title: job.title,
                  company: job.company_name ?? 'Entreprise',
                })}
                className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md"
              >
                <Text className="font-sans-semibold text-title-lg text-on-surface">{job.title}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">
                  {job.company_name ?? 'Entreprise'} · {job.city ?? 'Cameroun'}
                </Text>
                <Text className="font-sans-semibold text-label-md text-primary">
                  {job.salary_min ? formatCFA(job.salary_min) : 'Salaire à discuter'}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Reset */}
        <Pressable
          className="flex-row items-center justify-center gap-1"
          onPress={() => {
            setSector('');
            setCity('');
            setContracts([]);
            setSalary(750000);
            setQuery('');
          }}
        >
          <MaterialIcons name="refresh" size={18} color={colors.onSurfaceVariant} />
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
            Réinitialiser les filtres
          </Text>
        </Pressable>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="border-t border-outline-variant/20 px-container-margin py-md">
        <Pressable
          className="h-14 flex-row items-center justify-center gap-md rounded-lg bg-primary shadow-lg"
          onPress={searchJobs}
          disabled={searchLoading}
        >
          {searchLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="font-sans-bold text-headline-md text-on-primary">
              {hasSearched ? results.length + ' résultats' : 'Rechercher les offres'}
            </Text>
          )}
          <MaterialIcons name="chevron-right" size={22} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}
