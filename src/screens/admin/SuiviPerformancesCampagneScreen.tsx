import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void };
  route?: { params?: { campaignName?: string } };
};

const METRICS = [
  { label: 'Envoyés', value: '12 400', icon: 'send' as const },
  { label: 'Ouverts', value: '8 120', icon: 'mark-email-read' as const },
  { label: 'Cliqués', value: '2 340', icon: 'ads-click' as const },
  { label: 'Conversions', value: '186', icon: 'trending-up' as const },
];

export default function SuiviPerformancesCampagneScreen({ navigation, route }: Props) {
  const campaignName = route?.params?.campaignName ?? 'Relance candidats inactifs';

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary" numberOfLines={1}>{campaignName}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row flex-wrap gap-2">
          {METRICS.map((m) => (
            <View key={m.label} className="min-w-[47%] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <MaterialIcons name={m.icon} size={20} color={colors.primary} />
              <Text className="font-sans text-[11px] text-on-surface-variant">{m.label}</Text>
              <Text className="font-sans-bold text-headline-md text-on-surface">{m.value}</Text>
            </View>
          ))}
        </View>

        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Taux clés</Text>
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Taux d'ouverture</Text>
              <Text className="font-sans-bold text-label-lg text-primary">65.5%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Taux de clic</Text>
              <Text className="font-sans-bold text-label-lg text-primary">18.9%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-sans text-label-lg text-on-surface-variant">Taux de conversion</Text>
              <Text className="font-sans-bold text-label-lg text-secondary">1.5%</Text>
            </View>
          </View>
        </View>

        <Pressable className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-primary">
          <MaterialIcons name="download" size={18} color={colors.primary} />
          <Text className="font-sans-semibold text-label-lg text-primary">Exporter le rapport</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
