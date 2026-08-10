import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'DetailsCandidat'>;

const SKILLS = ['Design Systems', 'Accessibility (WCAG)', 'Figma', 'UX Research', 'Prototyping', 'User Testing'];

const EXPERIENCES = [
  {
    id: '1',
    role: 'Lead Product Designer',
    company: 'Digital S.A. • Douala',
    period: '2020 - Présent',
    current: true,
    bullets: [
      "Direction artistique et supervision d'une équipe de 4 designers.",
      "Refonte complète de l'application mobile (300k+ utilisateurs actifs).",
      'Mise en place du Design System "Unity" partagé par 3 pays.',
    ],
  },
  {
    id: '2',
    role: 'Senior UX UI Designer',
    company: 'Cameroon Soft Hub • Yaoundé',
    period: '2017 - 2020',
    current: false,
    bullets: ["Responsable de l'expérience utilisateur sur les solutions B2B de gestion de stocks et ERP locaux."],
  },
];

export default function DetailsCandidatScreen({ navigation, route }: Props) {
  const name = route.params?.name ?? 'Amandine N.';
  const role = route.params?.role ?? 'Designer Senior UX/UI';
  const matchScore = route.params?.matchScore ?? 94;

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Profil Candidat</Text>
        <MaterialIcons name="notifications" size={22} color={colors.primary} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Identity + AI match */}
        <View className="gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center gap-md">
            <View className="relative">
              <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-surface bg-primary/10 ring-4 ring-primary-container/20">
                <Text className="font-sans-bold text-headline-lg text-primary">
                  {name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </View>
              <View className="absolute -bottom-1 -right-1 flex-row items-center gap-1 rounded-full border-2 border-surface bg-secondary-container px-2 py-1">
                <MaterialIcons name="auto-awesome" size={10} color={colors.onSecondaryContainer} />
                <Text className="text-[10px] font-sans-bold text-on-secondary-container">{matchScore}%</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-headline-lg text-on-surface">{name}</Text>
              <Text className="font-sans-semibold text-title-lg text-primary">{role}</Text>
              <View className="mt-1 flex-row flex-wrap gap-md">
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={14} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-label-md text-on-surface-variant">Douala, CM</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="work-history" size={14} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-label-md text-on-surface-variant">8+ ans d'expérience</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2">
            <Pressable className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-sm">
              <MaterialIcons name="mail" size={16} color="#ffffff" />
              <Text className="font-sans-semibold text-label-lg text-white">Contacter</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('PlanifierEntretien', { candidateName: name, role })}
              className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full border border-primary-container bg-primary-container/10"
            >
              <MaterialIcons name="event" size={16} color={colors.primary} />
              <Text className="font-sans-semibold text-label-lg text-primary">Entretien</Text>
            </Pressable>
            <Pressable className="h-11 w-11 items-center justify-center rounded-full border border-outline">
              <MaterialIcons name="download" size={18} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        {/* Summary */}
        <View className="gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="person" size={20} color={colors.primary} />
            <Text className="font-sans-semibold text-headline-md text-on-surface">Résumé Professionnel</Text>
          </View>
          <Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">
            Designer passionné(e) par la création d'interfaces intuitives et impactantes. Forte d'une
            expérience significative dans le secteur de la Fintech et du E-commerce en Afrique Centrale.
            Expert(e) en Design Systems et prototypage haute fidélité.
          </Text>
        </View>

        {/* Experience timeline */}
        <View className="gap-lg rounded-lg border border-outline-variant bg-surface-container-lowest p-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="history-edu" size={20} color={colors.primary} />
            <Text className="font-sans-semibold text-headline-md text-on-surface">
              Expériences Professionnelles
            </Text>
          </View>
          {EXPERIENCES.map((exp) => (
            <View key={exp.id} className="flex-row gap-md">
              <View className="items-center">
                <View className={`h-4 w-4 rounded-full ${exp.current ? 'bg-primary-container' : 'bg-outline-variant'}`} />
                <View className="mt-1 w-[2px] flex-1 bg-outline-variant/50" />
              </View>
              <View className="flex-1 gap-1 pb-2">
                <View className="flex-row items-start justify-between gap-2">
                  <Text className="font-sans-semibold text-title-lg text-on-surface">{exp.role}</Text>
                  <View className={`rounded-full px-2 py-0.5 ${exp.current ? 'bg-secondary-container/20' : 'bg-surface-container-high'}`}>
                    <Text className={`text-[10px] font-sans-bold ${exp.current ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {exp.period}
                    </Text>
                  </View>
                </View>
                <Text className="font-sans-semibold text-label-lg text-primary">{exp.company}</Text>
                <View className="mt-1 gap-1">
                  {exp.bullets.map((b) => (
                    <View key={b} className="flex-row gap-2">
                      <Text className="text-on-surface-variant">•</Text>
                      <Text className="flex-1 font-sans text-body-md text-on-surface-variant">{b}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View className="gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="psychology" size={20} color={colors.primary} />
            <Text className="font-sans-semibold text-headline-md text-on-surface">Compétences</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <View key={skill} className="rounded-lg bg-surface-container-high px-md py-2">
                <Text className="font-sans-medium text-label-md text-on-surface-variant">{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recruiter notes */}
        <View className="gap-md rounded-lg bg-primary-container p-lg shadow-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="edit-note" size={20} color={colors.onPrimaryContainer} />
            <Text className="font-sans-semibold text-headline-md text-on-primary-container">
              Notes du recruteur
            </Text>
          </View>
          <Text className="font-sans text-body-md leading-relaxed text-on-primary-container/90">
            Excellente communication lors du premier échange téléphonique. Portfolio très solide,
            particulièrement sur les projets Fintech. À prioriser pour le second tour.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
