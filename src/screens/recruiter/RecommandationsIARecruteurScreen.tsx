import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

type Recommendation = {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  reason: string;
};

const RECOMMENDATIONS: Recommendation[] = [
  { id: '1', name: 'Ismaël T.', role: 'Développeur Backend Senior', matchScore: 96, reason: '8 ans en Node.js, expérience Fintech similaire à votre offre.' },
  { id: '2', name: 'Grace A.', role: 'Product Designer', matchScore: 91, reason: 'Portfolio aligné avec votre design system, disponible immédiatement.' },
  { id: '3', name: 'Willy K.', role: 'DevOps Engineer', matchScore: 87, reason: 'Certifié AWS, a travaillé sur des architectures à fort trafic.' },
];

export default function RecommandationsIARecruteurScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-container">
          <MaterialIcons name="psychology-alt" size={18} color={colors.onPrimaryContainer} />
        </View>
        <Text className="font-sans-bold text-headline-md text-primary">Recommandations IA</Text>
      </View>

      <FlatList
        data={RECOMMENDATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <Text className="mb-2 font-sans text-body-md text-on-surface-variant">
            Basé sur vos offres actives, voici les profils les plus pertinents identifiés par notre IA.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('DetailsCandidat', { name: item.name, role: item.role, matchScore: item.matchScore })}
            className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
          >
            <View className="flex-row items-center gap-md">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Text className="font-sans-bold text-label-lg text-primary">{item.name[0]}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-title-lg text-on-surface">{item.name}</Text>
                <Text className="font-sans text-label-lg text-on-surface-variant">{item.role}</Text>
              </View>
              <View className="flex-row items-center gap-1 rounded-full bg-secondary-container/30 px-3 py-1">
                <MaterialIcons name="recommend" size={14} color={colors.onSecondaryContainer} />
                <Text className="font-sans-bold text-label-md text-on-secondary-container">{item.matchScore}%</Text>
              </View>
            </View>
            <Text className="font-sans text-body-md text-on-surface-variant">{item.reason}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
