import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

const AVAILABLE_TESTS = [
  { id: '1', name: 'JavaScript Avancé', duration: '20 min', questions: 15, level: 'Intermédiaire' },
  { id: '2', name: 'Gestion de Projet Agile', duration: '15 min', questions: 12, level: 'Débutant' },
  { id: '3', name: 'Excel & Analyse de Données', duration: '25 min', questions: 18, level: 'Avancé' },
];

const COMPLETED_TESTS = [
  { id: '1', name: 'React & React Native', score: 92, badge: 'Expert' },
  { id: '2', name: 'Anglais Professionnel', score: 78, badge: 'Confirmé' },
];

export default function TestDeCompetencesScreen({ navigation }: Props) {
  const [started, setStarted] = useState<string | null>(null);

  if (started) {
    return (
      <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-secondary-container shadow-lg">
          <MaterialIcons name="emoji-events" size={44} color={colors.onSecondaryContainer} />
        </View>
        <Text className="font-sans-bold text-headline-lg text-on-surface">Certification obtenue !</Text>
        <Text className="text-center font-sans text-body-lg text-on-surface-variant">
          Vous avez obtenu un score de <Text className="font-sans-bold text-primary">88%</Text> — badge
          "Confirmé" ajouté à votre profil public.
        </Text>
        <Pressable onPress={() => setStarted(null)} className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg">
          <Text className="font-sans-semibold text-title-lg text-on-primary">Retour aux tests</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Tests de Compétences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Certifications obtenues</Text>
          <View className="flex-row gap-md">
            {COMPLETED_TESTS.map((t) => (
              <View key={t.id} className="flex-1 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <Pressable
                  onPress={() => navigation.navigate('ResultatsCertification', { testName: t.name, score: t.score })}
                  className="items-center gap-2"
                >
                  <MaterialIcons name="military-tech" size={28} color={colors.tertiary} />
                  <Text className="text-center font-sans-semibold text-label-lg text-on-surface">{t.name}</Text>
                  <Text className="font-sans-bold text-title-lg text-primary">{t.score}%</Text>
                  <View className="rounded-full bg-tertiary-fixed/30 px-2 py-0.5">
                    <Text className="text-[10px] font-sans-bold text-tertiary">{t.badge}</Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Tests disponibles</Text>
          <View className="gap-2">
            {AVAILABLE_TESTS.map((test) => (
              <View key={test.id} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="flex-row items-center gap-md">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                    <MaterialIcons name="quiz" size={20} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{test.name}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">
                      {test.questions} questions • {test.duration} • {test.level}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={() => setStarted(test.id)} className="h-10 items-center justify-center rounded-lg bg-primary-container">
                  <Text className="font-sans-semibold text-label-lg text-on-primary-container">Commencer le test</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
