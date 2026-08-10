import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void }; route?: { params?: { company?: string } } };

type Review = {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  timeAgo: string;
};

const REVIEWS: Review[] = [
  { id: '1', author: 'Employé actuel', role: 'Développeur', rating: 5, text: "Excellente culture d'entreprise, management à l'écoute et bon équilibre vie pro/perso.", timeAgo: 'Il y a 2 semaines' },
  { id: '2', author: 'Ancien employé', role: 'Chargé de clientèle', rating: 4, text: 'Bonnes opportunités de formation mais rythme de travail soutenu en période de forte activité.', timeAgo: 'Il y a 1 mois' },
  { id: '3', author: 'Employé actuel', role: 'Manager', rating: 4, text: 'Salaires compétitifs pour le marché camerounais, avantages sociaux corrects.', timeAgo: 'Il y a 2 mois' },
];

const CRITERIA = [
  { label: 'Équilibre vie pro/perso', score: 4.2 },
  { label: 'Salaire & avantages', score: 4.0 },
  { label: 'Culture & valeurs', score: 4.5 },
  { label: "Opportunités d'évolution", score: 3.8 },
];

export default function AvisCultureEntrepriseScreen({ navigation, route }: Props) {
  const company = route?.params?.company ?? 'MTN Cameroon';

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Avis Entreprise</Text>
      </View>

      <FlatList
        data={REVIEWS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-md gap-md">
            <View className="items-center gap-2 rounded-xl bg-primary p-lg shadow-lg">
              <Text className="font-sans-semibold text-label-lg text-white/80">{company}</Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="font-sans-extrabold text-display-lg text-white">4.2</Text>
                <Text className="font-sans text-white/70">/ 5</Text>
              </View>
              <View className="flex-row gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <MaterialIcons key={i} name="star" size={18} color="#FFD700" />
                ))}
                <MaterialIcons name="star-half" size={18} color="#FFD700" />
              </View>
              <Text className="font-sans text-label-md text-white/70">Basé sur 86 avis</Text>
            </View>

            <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              {CRITERIA.map((c) => (
                <View key={c.label} className="flex-row items-center justify-between">
                  <Text className="font-sans text-label-lg text-on-surface-variant">{c.label}</Text>
                  <View className="flex-row items-center gap-2">
                    <View className="h-2 w-20 overflow-hidden rounded-full bg-surface-variant">
                      <View className="h-full rounded-full bg-primary" style={{ width: `${(c.score / 5) * 100}%` }} />
                    </View>
                    <Text className="w-8 font-sans-semibold text-label-md text-on-surface">{c.score}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text className="font-sans-semibold text-title-lg text-on-surface">Avis des employés</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.author}</Text>
                <Text className="font-sans text-label-md text-on-surface-variant">{item.role}</Text>
              </View>
              <View className="flex-row gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <MaterialIcons key={i} name={i <= item.rating ? 'star' : 'star-border'} size={14} color={i <= item.rating ? colors.tertiary : colors.outlineVariant} />
                ))}
              </View>
            </View>
            <Text className="font-sans text-body-md text-on-surface-variant">{item.text}</Text>
            <Text className="font-sans text-[11px] text-outline">{item.timeAgo}</Text>
          </View>
        )}
      />
    </View>
  );
}
