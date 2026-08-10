import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
};

const PROJECTS: Project[] = [
  { id: '1', title: 'Application EmploiCamer', description: 'Refonte complète de l\u2019app mobile avec React Native & NativeWind.', tags: ['React Native', 'TypeScript'], link: 'github.com/example/emploicamer' },
  { id: '2', title: 'Plateforme e-commerce Kmer Market', description: 'Site marchand avec paiement Mobile Money intégré pour 200+ vendeurs.', tags: ['Next.js', 'Stripe', 'Mobile Money'] },
];

export default function PortfolioProjetsScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">Mon Portfolio</Text>
        </View>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-primary">
          <MaterialIcons name="add" size={20} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={PROJECTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        renderItem={({ item }) => (
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
            <View className="h-32 items-center justify-center rounded-lg bg-surface-container-high">
              <MaterialIcons name="collections-bookmark" size={32} color={colors.onSurfaceVariant} />
            </View>
            <Text className="font-sans-semibold text-title-lg text-on-surface">{item.title}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">{item.description}</Text>
            <View className="flex-row flex-wrap gap-2">
              {item.tags.map((tag) => (
                <View key={tag} className="rounded-full bg-primary/10 px-3 py-1">
                  <Text className="font-sans-medium text-label-md text-primary">{tag}</Text>
                </View>
              ))}
            </View>
            {item.link && (
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="link" size={16} color={colors.onSurfaceVariant} />
                <Text className="font-sans text-label-md text-on-surface-variant">{item.link}</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-md py-xl">
            <MaterialIcons name="collections-bookmark" size={48} color={colors.outline} />
            <Text className="font-sans text-body-md text-on-surface-variant">Ajoutez votre premier projet</Text>
          </View>
        }
      />
    </View>
  );
}
