import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { AdminStackParamList } from '../../navigation/types';

type Report = {
  id: string;
  jobTitle: string;
  company: string;
  reason: string;
  reportedBy: string;
  timeAgo: string;
  severe?: boolean;
};

const REPORTS: Report[] = [
  { id: '1', jobTitle: 'Ingénieur Software Senior', company: 'TechHub Douala', reason: 'Arnaque / Fraude', reportedBy: 'Jean M.', timeAgo: 'Il y a 5 min', severe: true },
  { id: '2', jobTitle: 'Agent de Sécurité (H/F)', company: 'Global Security SA', reason: 'Offre expirée', reportedBy: 'Marie-Noël K.', timeAgo: 'Il y a 22 min' },
  { id: '3', jobTitle: 'Comptable Junior', company: 'FastCash SARL', reason: 'Frais de dossier demandés', reportedBy: 'Paul E.', timeAgo: 'Il y a 40 min', severe: true },
];

export default function ModerationLitigesScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<NativeStackNavigationProp<AdminStackParamList>>();
  const [items, setItems] = useState(REPORTS);

  const resolve = (id: string) => setItems((list) => list.filter((r) => r.id !== id));

  return (
    <Screen>
      <View className="gap-1 px-container-margin pb-md pt-md">
        <Text className="font-sans-bold text-headline-lg text-on-surface">Modération</Text>
        <Text className="font-sans text-body-md text-on-surface-variant">
          File de signalements en attente de traitement.
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md flex-row gap-2">
            <View className="flex-1 gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <Text className="font-sans text-label-md text-on-surface-variant">En attente</Text>
              <Text className="font-sans-bold text-headline-md text-primary">{items.length}</Text>
              <Text className="flex-row font-sans text-[11px] text-secondary">-12% vs hier</Text>
            </View>
            <View className="flex-1 gap-1 rounded-xl bg-primary-container p-md shadow-lg">
              <Text className="font-sans text-label-md text-on-primary-container opacity-80">
                Temps de réponse
              </Text>
              <Text className="font-sans-bold text-headline-md text-on-primary-container">14 min</Text>
              <Text className="font-sans text-[11px] text-on-primary-container">Objectif : &lt; 15 min</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="gap-md rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row items-start gap-md">
              <View className="h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low">
                <MaterialIcons name="business" size={20} color={colors.onSurfaceVariant} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-start justify-between gap-2">
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-title-lg text-on-surface">{item.jobTitle}</Text>
                    <Text className="font-sans-medium text-body-md text-primary">{item.company}</Text>
                  </View>
                  <View className={`rounded-full px-3 py-1 ${item.severe ? 'bg-error-container' : 'bg-surface-container-highest'}`}>
                    <Text className={`font-sans-medium text-label-md ${item.severe ? 'text-on-error-container' : 'text-on-surface-variant'}`}>
                      {item.reason}
                    </Text>
                  </View>
                </View>
                <View className="mt-2 flex-row flex-wrap gap-md">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="person" size={16} color={colors.onSurfaceVariant} />
                    <Text className="font-sans text-body-md text-on-surface-variant">
                      Signalé par <Text className="font-sans-bold">{item.reportedBy}</Text>
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="schedule" size={16} color={colors.onSurfaceVariant} />
                    <Text className="font-sans text-body-md text-on-surface-variant">{item.timeAgo}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="flex-row gap-md border-t border-outline-variant/30 pt-md">
              <Pressable onPress={() => resolve(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg border border-outline">
                <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Ignorer</Text>
              </Pressable>
              {item.severe ? (
                <Pressable
                  onPress={() => stackNavigation?.navigate('GestionContentieuxAvance')}
                  className="h-10 flex-1 items-center justify-center rounded-lg bg-error shadow-sm"
                >
                  <Text className="font-sans-semibold text-label-lg text-on-error">Ouvrir le dossier</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => resolve(item.id)} className="h-10 flex-1 items-center justify-center rounded-lg bg-error shadow-sm">
                  <Text className="font-sans-semibold text-label-lg text-on-error">Supprimer l'offre</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="verified-user" size={48} color={colors.secondary} />
            <Text className="font-sans text-body-md text-on-surface-variant">
              File de modération vide — bon travail !
            </Text>
          </View>
        }
      />
    </Screen>
  );
}
