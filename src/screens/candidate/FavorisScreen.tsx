import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { CandidateStackParamList } from '../../navigation/types';

type SavedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAgo: string;
};

const FILTERS = ['Récents', 'Douala', 'Yaoundé', 'Tech'];

const SAVED_JOBS: SavedJob[] = [
  { id: '1', title: 'Product Designer Senior', company: 'Mabo Fintech', location: 'Douala', salary: '650.000 - 900.000 FCFA', postedAgo: 'Il y a 2h' },
  { id: '2', title: 'Ingénieur Télécom', company: 'Camtel', location: 'Yaoundé', salary: '500.000 - 700.000 FCFA', postedAgo: 'Il y a 6h' },
  { id: '3', title: 'Chargé de Clientèle', company: 'Afriland First Bank', location: 'Douala', salary: '350.000 FCFA', postedAgo: 'Hier' },
];

export default function FavorisScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CandidateStackParamList>>();
  const [activeFilter, setActiveFilter] = useState('Récents');
  const [saved, setSaved] = useState<Record<string, boolean>>(
    Object.fromEntries(SAVED_JOBS.map((j) => [j.id, true]))
  );

  return (
    <Screen>
      {/* Header */}
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Favoris</Text>
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-primary-fixed bg-surface-container-low">
          <Text className="font-sans-bold text-label-md text-primary">SN</Text>
        </View>
      </View>

      <FlatList
        data={SAVED_JOBS.filter((j) => saved[j.id])}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-md">
            <View className="flex-row gap-2">
              {FILTERS.map((filter) => {
                const active = filter === activeFilter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    className={`rounded-full px-lg py-2 ${active ? 'bg-primary-container' : 'bg-surface-container-high'}`}
                  >
                    <Text className={`font-sans-semibold text-label-lg ${active ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-sans text-body-md text-on-surface-variant">
                {Object.values(saved).filter(Boolean).length} offres enregistrées
              </Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="sort" size={18} color={colors.primary} />
                <Text className="font-sans-semibold text-label-lg text-primary">Trier par</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('DetailOffre', { title: item.title, company: item.company })}
            className="flex-row gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <View className="h-14 w-14 items-center justify-center rounded-md bg-surface-container">
              <MaterialIcons name="business" size={22} color={colors.onSurfaceVariant} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <Text className="font-sans-semibold text-headline-md text-on-surface">{item.title}</Text>
                  <Text className="mt-1 font-sans text-label-lg text-on-surface-variant">
                    {item.company} • {item.location}
                  </Text>
                </View>
                <Pressable onPress={() => setSaved((s) => ({ ...s, [item.id]: false }))} hitSlop={8}>
                  <MaterialIcons name="bookmark" size={22} color={colors.primary} />
                </Pressable>
              </View>
              <View className="mt-md flex-row items-center justify-between">
                <View className="rounded-full bg-secondary-container/20 px-md py-1">
                  <Text className="font-sans-semibold text-label-md text-on-secondary-container">
                    {item.salary}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="schedule" size={16} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-label-md text-on-surface-variant">{item.postedAgo}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="bookmark-border" size={48} color={colors.outline} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucune offre enregistrée</Text>
          </View>
        }
      />
    </Screen>
  );
}
