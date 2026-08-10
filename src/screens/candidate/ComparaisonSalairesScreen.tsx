import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '../../components/ui/Screen';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const CITIES = [
  { label: 'Douala', value: 'douala' },
  { label: 'Yaoundé', value: 'yaounde' },
  { label: 'Garoua', value: 'garoua' },
  { label: 'Bafoussam', value: 'bafoussam' },
];

const EXPERIENCE_LEVELS = [
  { label: 'Junior (0-2 ans)', percent: 35 },
  { label: 'Confirmé (3-5 ans)', percent: 65 },
  { label: 'Senior (6+ ans)', percent: 90 },
];

export default function ComparaisonSalairesScreen({ navigation }: Props) {
  const [jobTitle, setJobTitle] = useState('Développeur Fullstack');
  const [city, setCity] = useState('douala');

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Comparaison des Salaires</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Search */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Intitulé du poste</Text>
            <View className="h-12 flex-row items-center rounded-xl border border-outline-variant bg-surface px-md">
              <MaterialIcons name="search" size={18} color={colors.outline} />
              <TextInput
                value={jobTitle}
                onChangeText={setJobTitle}
                className="ml-2 flex-1 font-sans text-body-md text-on-surface"
              />
            </View>
          </View>
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Localisation</Text>
            <SelectField icon="location-on" placeholder="Ville" options={CITIES} value={city} onChange={setCity} />
          </View>
        </View>

        {/* Market overview */}
        <View className="gap-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Aperçu du marché (FCFA)</Text>
            <View className="flex-row items-center gap-1 rounded-full bg-secondary-container px-3 py-1">
              <MaterialIcons name="trending-up" size={14} color={colors.onSecondaryContainer} />
              <Text className="font-sans-medium text-label-md text-on-secondary-container">Marché dynamique</Text>
            </View>
          </View>

          <View className="gap-2">
            <View className="h-3 w-full flex-row overflow-hidden rounded-full bg-surface-variant">
              <View className="w-[55%] bg-primary" />
              <View className="flex-1 bg-surface-variant" />
            </View>
            <View className="flex-row justify-between">
              <View className="items-start">
                <Text className="font-sans text-label-md text-on-surface-variant">450k</Text>
                <Text className="text-[10px] uppercase tracking-wider text-outline">Min</Text>
              </View>
              <View className="items-center">
                <Text className="font-sans-bold text-label-lg text-primary">750k</Text>
                <Text className="text-[10px] uppercase tracking-wider text-primary">Moyenne</Text>
              </View>
              <View className="items-end">
                <Text className="font-sans text-label-md text-on-surface-variant">1.2M</Text>
                <Text className="text-[10px] uppercase tracking-wider text-outline">Max</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-md rounded-xl border border-primary/10 bg-primary-fixed/30 p-md">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
              <MaterialIcons name="analytics" size={20} color="#ffffff" />
            </View>
            <View>
              <Text className="font-sans text-label-md text-on-primary-fixed">Votre profil se situe</Text>
              <Text className="font-sans-bold text-title-lg text-primary">15% au-dessus</Text>
              <Text className="font-sans text-label-md text-on-primary-fixed-variant">de la moyenne locale</Text>
            </View>
          </View>
        </View>

        {/* Experience breakdown */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Évolution par expérience</Text>
          <View className="gap-md">
            {EXPERIENCE_LEVELS.map((level) => (
              <View key={level.label} className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-medium text-label-lg text-on-surface">{level.label}</Text>
                  <Text className="font-sans-semibold text-label-md text-primary">
                    {Math.round((level.percent / 100) * 1200)}k FCFA
                  </Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View className="h-full rounded-full bg-primary/70" style={{ width: `${level.percent}%` }} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
