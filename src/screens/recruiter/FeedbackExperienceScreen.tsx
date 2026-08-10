import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const QUESTIONS = [
  'Qualité des candidatures reçues',
  "Facilité d'utilisation de la plateforme",
  'Rapport qualité-prix de votre abonnement',
];

export default function FeedbackExperienceScreen({ navigation }: Props) {
  const [ratings, setRatings] = useState<number[]>([0, 0, 0]);
  const [comment, setComment] = useState('');

  const setRating = (index: number, value: number) => {
    setRatings((r) => r.map((v, i) => (i === index ? value : v)));
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Votre avis compte</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <Text className="font-sans text-body-lg text-on-surface-variant">
          Aidez-nous à améliorer EmploiCamer en partageant votre expérience de recrutement récente.
        </Text>

        {QUESTIONS.map((q, index) => (
          <View key={q} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <Text className="font-sans-semibold text-label-lg text-on-surface">{q}</Text>
            <View className="flex-row gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Pressable key={i} onPress={() => setRating(index, i)} hitSlop={4}>
                  <MaterialIcons
                    name={i <= ratings[index] ? 'star' : 'star-border'}
                    size={28}
                    color={i <= ratings[index] ? colors.tertiary : colors.outlineVariant}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
            Commentaires additionnels (optionnel)
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Qu'est-ce qui pourrait être amélioré ?"
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
          />
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="send" size={18} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer mon avis</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
