import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const ARTICLES: Article[] = [
  { id: '1', category: 'Entretien', title: '5 questions pièges en entretien et comment y répondre', excerpt: 'Les recruteurs camerounais posent souvent ces questions pour tester votre sang-froid...', readTime: '4 min', icon: 'forum' },
  { id: '2', category: 'CV', title: 'Comment structurer un CV qui passe les filtres ATS', excerpt: 'La majorité des grandes entreprises utilisent un logiciel de tri automatique...', readTime: '6 min', icon: 'article' },
  { id: '3', category: 'Négociation', title: 'Négocier son salaire sans se braquer son recruteur', excerpt: 'Des techniques concrètes pour aborder la question salariale avec confiance.', readTime: '5 min', icon: 'trending-flat' },
  { id: '4', category: 'Carrière', title: 'Se reconvertir dans la tech après 30 ans : le guide', excerpt: 'Des parcours inspirants de professionnels camerounais qui ont changé de voie.', readTime: '8 min', icon: 'rocket-launch' },
];

export default function ConseilsCarriereScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Conseils Carrière</Text>
      </View>

      <FlatList
        data={ARTICLES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        renderItem={({ item }) => (
          <Pressable className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
            <View className="flex-row items-center gap-md">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <MaterialIcons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View className="rounded-full bg-secondary-container/30 px-3 py-1">
                <Text className="font-sans-medium text-label-md text-on-secondary-container">{item.category}</Text>
              </View>
            </View>
            <Text className="font-sans-semibold text-title-lg leading-snug text-on-surface">{item.title}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant" numberOfLines={2}>{item.excerpt}</Text>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="schedule" size={14} color={colors.outline} />
              <Text className="font-sans text-label-md text-outline">{item.readTime} de lecture</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
