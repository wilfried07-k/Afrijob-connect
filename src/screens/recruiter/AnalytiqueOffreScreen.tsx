import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void }; route?: { params?: { title?: string } } };

const SOURCES = [
  { label: 'Recherche organique', percent: 42, color: colors.primary },
  { label: 'Recommandations IA', percent: 31, color: colors.secondary },
  { label: 'Réseaux sociaux', percent: 18, color: colors.tertiary },
  { label: 'Autre', percent: 9, color: colors.outline },
];

export default function AnalytiqueOffreScreen({ navigation, route }: Props) {
  const title = route?.params?.title ?? 'Développeur Fullstack Senior';

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary" numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row gap-2">
          {[
            { label: 'Vues', value: '1 240', icon: 'visibility' as const },
            { label: 'Candidatures', value: '84', icon: 'description' as const },
            { label: 'Taux de conv.', value: '6.8%', icon: 'trending-up' as const },
          ].map((s) => (
            <View key={s.label} className="flex-1 gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <MaterialIcons name={s.icon} size={18} color={colors.primary} />
              <Text className="font-sans text-[10px] text-on-surface-variant">{s.label}</Text>
              <Text className="font-sans-bold text-title-lg text-on-surface">{s.value}</Text>
            </View>
          ))}
        </View>

        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Provenance des candidatures</Text>
          <View className="gap-md">
            {SOURCES.map((s) => (
              <View key={s.label} className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans text-label-lg text-on-surface-variant">{s.label}</Text>
                  <Text className="font-sans-semibold text-label-md text-on-surface">{s.percent}%</Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View className="h-full rounded-full" style={{ width: `${s.percent}%`, backgroundColor: s.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row items-start gap-md rounded-xl border border-primary/10 bg-primary-container/5 p-md">
          <MaterialIcons name="lightbulb" size={20} color={colors.primary} />
          <Text className="flex-1 font-sans text-body-md text-on-surface-variant">
            Cette offre performe 22% mieux que la moyenne de votre secteur. Envisagez de la sponsoriser
            pour toucher davantage de profils qualifiés.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
