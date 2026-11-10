import { useState } from 'react';
import { Modal, ScrollView, View, Text, Pressable, FlatList } from 'react-native';
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
  body: string[];
};

const ARTICLES: Article[] = [
  { id: '1', category: 'Entretien', title: '5 questions pièges en entretien et comment y répondre', excerpt: 'Préparez des réponses concrètes sans réciter un texte appris par cœur.', readTime: '4 min', icon: 'forum', body: ['Parlez-moi de vous : choisissez trois expériences qui expliquent votre parcours et reliez-les au poste visé.', 'Quel est votre principal point de progression ? Présentez un exemple réel et la méthode que vous utilisez pour progresser.', 'Pourquoi notre entreprise ? Citez un produit, un projet ou un enjeu précis qui vous intéresse.', 'Pourquoi vous plutôt qu’un autre candidat ? Appuyez votre réponse sur une compétence et un résultat vérifiable.', 'Avez-vous des questions ? Interrogez l’équipe sur les priorités du poste, les objectifs des premiers mois et les prochaines étapes.'] },
  { id: '2', category: 'CV', title: 'Comment structurer un CV qui passe les filtres ATS', excerpt: 'Une structure lisible aide les logiciels de tri et les recruteurs à repérer vos compétences.', readTime: '6 min', icon: 'article', body: ['Utilisez des rubriques conventionnelles : expérience, formation, compétences et langues.', 'Reprenez les mots-clés de l’offre uniquement lorsqu’ils correspondent à votre expérience réelle.', 'Préférez une mise en page simple, une colonne et des titres explicites. Les tableaux, icônes et zones de texte peuvent perturber l’extraction.', 'Décrivez chaque expérience avec une action, son contexte et un résultat mesurable.', 'Relisez le PDF en sélectionnant son texte : si l’ordre de lecture est incohérent, simplifiez la mise en page.'] },
  { id: '3', category: 'Négociation', title: 'Négocier son salaire avec confiance', excerpt: 'Des repères concrets pour discuter rémunération et conditions sans improviser.', readTime: '5 min', icon: 'trending-flat', body: ['Avant l’échange, définissez une fourchette réaliste en tenant compte du niveau du poste, du secteur, de la ville et de votre expérience.', 'Présentez vos résultats et les responsabilités que vous pouvez prendre en charge avant d’annoncer vos attentes.', 'Demandez le détail du package : salaire fixe, variable, assurance, transport, matériel et révision salariale.', 'Si le budget est inférieur à votre cible, explorez d’autres leviers ou proposez une réévaluation après une période convenue.', 'Confirmez les éléments acceptés par écrit avant de vous engager.'] },
  { id: '4', category: 'Carrière', title: 'Préparer une reconversion professionnelle', excerpt: 'Construisez une transition réaliste à partir de vos compétences transférables.', readTime: '8 min', icon: 'rocket-launch', body: ['Faites l’inventaire de vos compétences actuelles et repérez celles qui sont utiles dans le métier ciblé.', 'Échangez avec des professionnels du domaine pour vérifier le quotidien, les prérequis et les débouchés.', 'Choisissez une formation ou un projet pratique qui produit une preuve de compétence montrable.', 'Testez votre projet avec une mission courte, un projet associatif ou un portfolio avant de quitter votre activité.', 'Découpez la transition en étapes et fixez un budget et un calendrier soutenables.'] },
];

export default function ConseilsCarriereScreen({ navigation }: Props) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [category, setCategory] = useState('Tout');
  const categories = ['Tout', ...ARTICLES.map((article) => article.category)];
  const visibleArticles = category === 'Tout' ? ARTICLES : ARTICLES.filter((article) => article.category === category);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Conseils Carrière</Text>
      </View>

      <FlatList
        data={visibleArticles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        ListHeaderComponent={<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>{categories.map((item) => <Pressable key={item} onPress={() => setCategory(item)} className={`rounded-full border px-4 py-2 ${category === item ? 'border-primary bg-primary-container' : 'border-outline-variant bg-surface-container-lowest'}`}><Text className={`font-sans-semibold text-label-md ${category === item ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{item}</Text></Pressable>)}</ScrollView>}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelectedArticle(item)} className="gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg">
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
            <View className="flex-row items-center justify-between"><View className="flex-row items-center gap-1">
              <MaterialIcons name="schedule" size={14} color={colors.outline} />
              <Text className="font-sans text-label-md text-outline">{item.readTime} de lecture</Text>
            </View><MaterialIcons name="arrow-forward" size={18} color={colors.primary} /></View>
          </Pressable>
        )}
      />
      <Modal visible={selectedArticle !== null} animationType="slide" onRequestClose={() => setSelectedArticle(null)}>
        {selectedArticle ? <View className="flex-1 bg-background"><View className="h-16 flex-row items-center gap-3 border-b border-outline-variant/20 px-container-margin"><Pressable onPress={() => setSelectedArticle(null)} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-title-lg text-primary">Conseils Carrière</Text></View><ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}><Text className="font-sans-semibold text-label-lg text-secondary">{selectedArticle.category} · {selectedArticle.readTime}</Text><Text className="font-sans-bold text-headline-lg text-on-surface">{selectedArticle.title}</Text><Text className="font-sans text-body-lg text-on-surface-variant">{selectedArticle.excerpt}</Text>{selectedArticle.body.map((paragraph, index) => <View key={paragraph} className="flex-row gap-3"><Text className="font-sans-bold text-label-lg text-primary">{index + 1}.</Text><Text className="flex-1 font-sans text-body-lg leading-7 text-on-surface">{paragraph}</Text></View>)}</ScrollView></View> : null}
      </Modal>
    </View>
  );
}
