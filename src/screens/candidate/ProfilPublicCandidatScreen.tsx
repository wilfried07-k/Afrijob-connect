import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'ProfilPublicCandidat'>;

const SKILLS = ['TypeScript', 'React', 'Node.js', 'Docker', 'PostgreSQL', 'GraphQL'];

const EXPERIENCES = [
  {
    id: '1',
    role: 'Lead Developer Fullstack',
    company: 'InnovTech Solutions • Temps plein',
    period: '2020 - Présent',
    current: true,
    bullets: [
      "Direction technique d'une équipe de 5 développeurs sur un projet SaaS.",
      "Migration de l'infrastructure vers une architecture microservices (AWS).",
      "Optimisation des temps de chargement de l'application de 40%.",
    ],
  },
  {
    id: '2',
    role: 'Développeur Backend',
    company: 'GlobalConnect Africa • CDD',
    period: '2017 - 2020',
    current: false,
    bullets: [
      "Conception et maintenance d'APIs REST complexes pour des systèmes financiers à haute disponibilité.",
    ],
  },
];

export default function ProfilPublicCandidatScreen({ navigation }: Props) {
  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Profil public</Text>
        <MaterialIcons name="share" size={22} color={colors.primary} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero */}
        <View className="h-24 w-full bg-primary/90" />
        <View className="-mt-10 px-container-margin">
          <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-surface bg-surface shadow-md">
            <Text className="font-sans-bold text-headline-lg text-primary">SN</Text>
          </View>
          <Text className="mt-md font-sans-bold text-headline-lg text-on-surface">Samuel Ndongo</Text>
          <Text className="font-sans-semibold text-title-lg text-primary">Senior Fullstack Developer</Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MaterialIcons name="location-on" size={16} color={colors.onSurfaceVariant} />
            <Text className="font-sans text-label-lg text-on-surface-variant">Douala, Cameroun</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="mt-lg flex-row gap-md px-container-margin">
          <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-primary-container">
            <MaterialIcons name="mail" size={18} color={colors.onPrimaryContainer} />
            <Text className="font-sans-semibold text-label-lg text-on-primary-container">Contact</Text>
          </Pressable>
          <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-surface-container-high">
            <MaterialIcons name="download" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Télécharger CV</Text>
          </Pressable>
        </View>

        <View className="gap-md px-container-margin py-lg">
          {/* Summary */}
          <View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm">
            <View className="mb-md flex-row items-center gap-2">
              <MaterialIcons name="person-search" size={20} color={colors.primary} />
              <Text className="font-sans-semibold text-headline-md text-on-surface">Résumé Professionnel</Text>
            </View>
            <Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">
              Développeur passionné avec plus de 8 ans d'expérience dans la conception d'architectures
              scalables. Expert en écosystèmes React et Node.js, j'accompagne les entreprises dans leur
              transformation digitale.
            </Text>
          </View>

          {/* Skills */}
          <View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm">
            <View className="mb-md flex-row items-center gap-2">
              <MaterialIcons name="bolt" size={20} color={colors.primary} />
              <Text className="font-sans-semibold text-headline-md text-on-surface">Compétences</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <View key={skill} className="rounded-full border border-outline-variant/20 bg-surface-container-low px-md py-1">
                  <Text className="font-sans text-label-md text-on-surface-variant">{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Experience */}
          <View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm">
            <View className="mb-lg flex-row items-center gap-2">
              <MaterialIcons name="work" size={20} color={colors.primary} />
              <Text className="font-sans-semibold text-headline-md text-on-surface">Expérience Clé</Text>
            </View>
            <View className="gap-lg">
              {EXPERIENCES.map((exp) => (
                <View key={exp.id} className="flex-row gap-md">
                  <View className="h-12 w-12 items-center justify-center rounded-lg bg-surface-container">
                    <MaterialIcons name="business" size={20} color={colors.onSurfaceVariant} />
                  </View>
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="flex-1">
                        <Text className="font-sans-semibold text-title-lg text-on-surface">{exp.role}</Text>
                        <Text className="font-sans text-label-lg text-on-surface-variant">{exp.company}</Text>
                      </View>
                      <View className={`rounded-lg px-md py-1 ${exp.current ? 'bg-secondary-container/30' : 'bg-surface-container-high'}`}>
                        <Text className={`font-sans text-label-md ${exp.current ? 'text-secondary' : 'text-on-surface-variant'}`}>
                          {exp.period}
                        </Text>
                      </View>
                    </View>
                    <View className="mt-1 gap-1">
                      {exp.bullets.map((bullet) => (
                        <View key={bullet} className="flex-row gap-2">
                          <Text className="text-on-surface-variant">•</Text>
                          <Text className="flex-1 font-sans text-body-md text-on-surface-variant">{bullet}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Education */}
          <View className="rounded-lg border border-outline-variant/20 bg-white p-lg shadow-sm">
            <View className="mb-md flex-row items-center gap-2">
              <MaterialIcons name="school" size={20} color={colors.primary} />
              <Text className="font-sans-semibold text-headline-md text-on-surface">Éducation</Text>
            </View>
            <View className="flex-row items-start gap-md">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MaterialIcons name="school" size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-title-lg text-on-surface">
                  Master en Génie Logiciel
                </Text>
                <Text className="font-sans text-label-lg text-on-surface-variant">
                  Institut Africain d'Informatique • 2013 - 2015
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
