import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const TIPS = [
  { icon: 'edit-document' as const, title: 'Rédigez des offres précises', body: "Détaillez missions, compétences requises et fourchette salariale pour attirer les bons profils." },
  { icon: 'bolt' as const, title: 'Répondez rapidement', body: 'Les candidats contactés sous 48h ont 3x plus de chances de rester engagés dans le processus.' },
  { icon: 'diversity-3' as const, title: 'Valorisez la diversité', body: "Évitez les critères discriminants dans vos annonces (âge, genre, origine)." },
  { icon: 'verified' as const, title: 'Restez transparent', body: "Ne demandez jamais de frais aux candidats — c'est interdit sur la plateforme et signalé automatiquement." },
];

export default function GuideBonnesPratiquesScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Bonnes Pratiques</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        <Text className="font-sans text-body-md text-on-surface-variant">
          Quelques recommandations pour un recrutement efficace et responsable sur EmploiCamer.
        </Text>
        {TIPS.map((tip) => (
          <View key={tip.title} className="flex-row items-start gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <MaterialIcons name={tip.icon} size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{tip.title}</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">{tip.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
