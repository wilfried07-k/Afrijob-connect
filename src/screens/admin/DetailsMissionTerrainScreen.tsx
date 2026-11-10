import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
};

export default function DetailsMissionTerrainScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mission Terrain</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center gap-md">
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MaterialIcons name="apartment" size={22} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-title-lg text-on-surface">Kmer Digital Services</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">Vérification KYC sur site</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="location-on" size={16} color={colors.onSurfaceVariant} />
            <Text className="font-sans text-label-lg text-on-surface-variant">Bonanjo, Douala</Text>
          </View>
        </View>

        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-lg text-on-surface-variant">Date prévue</Text>
            <Text className="font-sans-semibold text-label-lg text-on-surface">16 Juillet, 10:00</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-lg text-on-surface-variant">Agent assigné</Text>
            <Text className="font-sans-semibold text-label-lg text-on-surface">Roger Fokou</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-lg text-on-surface-variant">Statut</Text>
            <View className="rounded-full bg-primary/10 px-2 py-0.5">
              <Text className="text-[10px] font-sans-bold text-primary">Planifiée</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('KYCAgentTerrain')}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="document-scanner" size={20} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Démarrer la vérification</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
