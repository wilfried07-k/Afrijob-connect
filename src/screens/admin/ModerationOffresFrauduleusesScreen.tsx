import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type FlaggedJob = { id: string; title: string; company: string; flags: number; reason: string };

const JOBS: FlaggedJob[] = [
  { id: '1', title: 'Agent commercial (revenus garantis)', company: 'QuickCash Ltd', flags: 24, reason: 'Promesses de gains irréalistes' },
  { id: '2', title: 'Data Entry - Travail à domicile', company: 'GlobalWork Inc', flags: 15, reason: 'Entreprise non vérifiable' },
];

export default function ModerationOffresFrauduleusesScreen({ navigation }: Props) {
  const [jobs, setJobs] = useState(JOBS);
  const remove = (id: string) => setJobs((list) => list.filter((j) => j.id !== id));

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Offres Frauduleuses</Text>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <Text className="mb-2 font-sans text-body-md text-on-surface-variant">
            Offres détectées automatiquement par notre système anti-fraude.
          </Text>
        }
        renderItem={({ item }) => (
          <View className="gap-2 rounded-xl border border-error/20 bg-error-container/5 p-md shadow-sm">
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1">
                <Text className="font-sans-semibold text-title-lg text-on-surface">{item.title}</Text>
                <Text className="font-sans text-body-md text-on-surface-variant">{item.company}</Text>
              </View>
              <View className="flex-row items-center gap-1 rounded-full bg-error px-2 py-0.5">
                <MaterialIcons name="gpp-bad" size={12} color="#ffffff" />
                <Text className="text-[10px] font-sans-bold text-white">{item.flags} signalements</Text>
              </View>
            </View>
            <Text className="font-sans text-label-md text-error">{item.reason}</Text>
            <View className="flex-row gap-2 border-t border-error/10 pt-md">
              <Pressable onPress={() => remove(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg border border-outline">
                <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Ignorer</Text>
              </Pressable>
              <Pressable onPress={() => remove(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg bg-error shadow-sm">
                <Text className="font-sans-semibold text-label-lg text-on-error">Supprimer & Bannir</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="verified-user" size={48} color={colors.secondary} />
            <Text className="font-sans text-body-md text-on-surface-variant">Aucune offre suspecte détectée</Text>
          </View>
        }
      />
    </View>
  );
}
