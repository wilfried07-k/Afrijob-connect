import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CoffreFortDocuments'>;

type Doc = {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAgo: string;
  isMain?: boolean;
};

const DOCUMENTS: Doc[] = [
  { id: '1', name: 'CV_Ingenieur_Fullstack.pdf', type: 'PDF', size: '1.2 Mo', updatedAgo: 'Il y a 2j', isMain: true },
  { id: '2', name: 'Lettre_Motivation_MTN.pdf', type: 'PDF', size: '340 Ko', updatedAgo: 'Il y a 5j' },
  { id: '3', name: 'Diplome_Master_2015.pdf', type: 'PDF', size: '890 Ko', updatedAgo: 'Il y a 3 mois' },
  { id: '4', name: 'Certification_AWS.pdf', type: 'PDF', size: '410 Ko', updatedAgo: 'Il y a 1 mois' },
];

const USED_MB = 2.5;
const TOTAL_MB = 10;

export default function CoffreFortDocumentsScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const filtered = DOCUMENTS.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const usagePercent = Math.round((USED_MB / TOTAL_MB) * 100);

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Coffre-fort Numérique</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-lg">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="shield" size={18} color={colors.primary} />
              <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-primary">
                Espace sécurisé
              </Text>
            </View>
            <Text className="font-sans text-body-md text-on-surface-variant">
              Gérez vos CV, lettres et diplômes en toute sécurité.
            </Text>

            {/* Storage */}
            <View className="rounded-xl border border-outline-variant/30 bg-white p-md shadow-sm">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-sans-semibold text-label-lg text-on-surface">Espace utilisé</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">
                  {USED_MB} Mo / {TOTAL_MB} Mo
                </Text>
              </View>
              <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <View className="h-full rounded-full bg-primary" style={{ width: `${usagePercent}%` }} />
              </View>
              <Text className="mt-2 font-sans text-label-md text-on-surface-variant">
                {usagePercent}% de votre stockage gratuit utilisé
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row flex-wrap gap-2">
              <Pressable className="flex-row items-center gap-2 rounded-xl bg-primary-container px-lg py-3 shadow-sm">
                <MaterialIcons name="upload" size={18} color={colors.onPrimaryContainer} />
                <Text className="font-sans-semibold text-label-lg text-on-primary-container">
                  Ajouter un document
                </Text>
              </Pressable>
              <Pressable className="flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-lg py-3">
                <MaterialIcons name="create-new-folder" size={18} color={colors.onSurfaceVariant} />
                <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
                  Nouveau dossier
                </Text>
              </Pressable>
            </View>

            {/* Search */}
            <View className="h-12 flex-row items-center rounded-xl border border-outline-variant bg-white px-md">
              <MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Rechercher un document..."
                placeholderTextColor={colors.outline}
                className="ml-2 flex-1 font-sans text-body-md text-on-surface"
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-1 gap-md rounded-xl border border-outline-variant/30 bg-white p-md shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MaterialIcons name="description" size={26} color={colors.primary} />
              </View>
              <Pressable hitSlop={8}>
                <MaterialIcons name="more-vert" size={18} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
            <Text className="font-sans-semibold text-label-lg text-on-surface" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="font-sans text-label-md text-on-surface-variant">
              {item.type} • {item.size} • {item.updatedAgo}
            </Text>
            {item.isMain && (
              <View className="self-start rounded-full bg-secondary-container px-2 py-0.5">
                <Text className="text-[10px] font-sans-bold text-on-secondary-container">CV Principal</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="folder-open" size={48} color={colors.outline} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucun document trouvé</Text>
          </View>
        }
      />
    </Screen>
  );
}
