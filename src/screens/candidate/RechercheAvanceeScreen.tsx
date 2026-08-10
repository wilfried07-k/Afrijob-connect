import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';

const SECTORS = [
  { label: 'Tous les secteurs', value: '' },
  { label: 'Informatique & Télécom', value: 'it' },
  { label: 'Banque & Finance', value: 'finance' },
  { label: 'Santé & Social', value: 'health' },
  { label: 'Enseignement', value: 'education' },
  { label: 'BTP & Construction', value: 'construction' },
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
  { label: 'Stage', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
];

const RECENT_SEARCHES = ['UI Designer Douala', 'Comptable Yaoundé', 'Développeur Fullstack'];

const formatCFA = (value: number) => `${new Intl.NumberFormat('fr-FR').format(Math.round(value))} FCFA +`;

export default function RechercheAvanceeScreen() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('');
  const [contracts, setContracts] = useState<string[]>(['cdi']);
  const [nearMe, setNearMe] = useState(false);
  const [salary, setSalary] = useState(750000);

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
        {/* Recent searches */}
        <View className="gap-md">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Recherches récentes</Text>
            <Text className="font-sans-medium text-label-md text-primary">Effacer</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {RECENT_SEARCHES.map((search) => (
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

          <View className="flex-row items-center gap-md rounded-lg border border-outline-variant/50 bg-surface-container-low p-md">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MaterialIcons name="near-me" size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">Autour de moi</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">
                Rechercher dans un rayon de 10km
              </Text>
            </View>
            <Switch
              value={nearMe}
              onValueChange={setNearMe}
              trackColor={{ true: colors.primary, false: colors.outlineVariant }}
            />
          </View>
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

        {/* Premium promo */}
        <View className="rounded-lg bg-primary p-lg shadow-lg">
          <View className="flex-row items-start justify-between gap-md">
            <View className="flex-1 gap-2">
              <View className="self-start rounded-full bg-white/20 px-2 py-0.5">
                <Text className="font-sans-bold text-[10px] uppercase tracking-widest text-white">
                  Premium
                </Text>
              </View>
              <Text className="font-sans-bold text-headline-md leading-tight text-white">
                Accédez aux offres exclusives
              </Text>
              <Text className="font-sans text-body-md text-white/90">
                Certaines entreprises recrutent uniquement via nos services Premium de chasse de tête.
              </Text>
            </View>
            <MaterialIcons name="workspace-premium" size={32} color="#ffffff" />
          </View>
          <Pressable className="mt-md self-start rounded-md bg-white px-md py-2">
            <Text className="font-sans-semibold text-label-lg text-primary">En savoir plus</Text>
          </Pressable>
        </View>

        {/* Reset */}
        <Pressable
          className="flex-row items-center justify-center gap-1"
          onPress={() => {
            setSector('');
            setCity('');
            setContracts([]);
            setNearMe(false);
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
        <Pressable className="h-14 flex-row items-center justify-center gap-md rounded-lg bg-primary shadow-lg">
          <Text className="font-sans-bold text-headline-md text-on-primary">Afficher 142 résultats</Text>
          <MaterialIcons name="chevron-right" size={22} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}
