import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Agent = { id: string; name: string; zone: string; visits: number; status: 'Actif' | 'En mission' | 'Hors ligne' };

const AGENTS: Agent[] = [
  { id: '1', name: 'Roger Fokou', zone: 'Douala - Akwa/Bonanjo', visits: 12, status: 'En mission' },
  { id: '2', name: 'Brenda Ngo', zone: 'Yaoundé - Centre', visits: 8, status: 'Actif' },
  { id: '3', name: 'Serge Mballa', zone: 'Bafoussam', visits: 5, status: 'Hors ligne' },
];

const STATUS_STYLE: Record<Agent['status'], { bg: string; text: string }> = {
  Actif: { bg: 'bg-secondary/10', text: 'text-secondary' },
  'En mission': { bg: 'bg-primary/10', text: 'text-primary' },
  'Hors ligne': { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

export default function GestionEquipesAgentsScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Équipes d'Agents Terrain</Text>
      </View>

      <FlatList
        data={AGENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => {
          const style = STATUS_STYLE[item.status];
          return (
            <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
                <Text className="font-sans-bold text-label-lg text-on-surface-variant">{item.name[0]}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.name}</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="map" size={12} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-label-md text-on-surface-variant">{item.zone}</Text>
                </View>
              </View>
              <View className="items-end gap-1">
                <View className={`rounded-full px-2 py-0.5 ${style.bg}`}>
                  <Text className={`text-[10px] font-sans-bold ${style.text}`}>{item.status}</Text>
                </View>
                <Text className="font-sans text-[10px] text-outline">{item.visits} visites/mois</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
