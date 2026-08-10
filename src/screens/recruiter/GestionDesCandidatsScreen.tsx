import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { RecruiterStackParamList } from '../../navigation/types';

type Candidate = {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  summary: string;
};

type Column = {
  key: string;
  title: string;
  candidates: Candidate[];
};

const COLUMNS: Column[] = [
  {
    key: 'new',
    title: 'Nouveaux',
    candidates: [
      { id: '1', name: 'Amandine N.', role: 'Designer Senior', matchScore: 94, summary: "Expertise en design system et accessibilité. 6 ans d'expérience chez Digital S.A." },
      { id: '2', name: 'Samuel E.', role: 'UI/UX Junior', matchScore: 78, summary: 'Passionné par les interactions mobiles. Portfolio solide en Fintech.' },
    ],
  },
  {
    key: 'sorted',
    title: 'Triés',
    candidates: [
      { id: '3', name: 'Rita B.', role: 'Product Designer', matchScore: 88, summary: '5 ans en agence digitale, spécialisée en recherche utilisateur.' },
    ],
  },
  {
    key: 'interview',
    title: 'Entretien',
    candidates: [
      { id: '4', name: 'Foka M.', role: 'Designer Lead', matchScore: 91, summary: 'A dirigé une équipe de 4 designers chez une fintech panafricaine.' },
    ],
  },
  {
    key: 'hired',
    title: 'Embauchés',
    candidates: [],
  },
];

function ScoreBadge({ score }: { score: number }) {
  const high = score >= 85;
  return (
    <View className={`flex-row items-center gap-1 rounded-md px-2 py-1 ${high ? 'bg-secondary-container/30' : 'bg-surface-container-highest'}`}>
      <MaterialIcons name="bolt" size={14} color={high ? colors.onSecondaryContainer : colors.onSurfaceVariant} />
      <Text className={`font-sans-bold text-xs ${high ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}>
        {score}%
      </Text>
    </View>
  );
}

export default function GestionDesCandidatsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  return (
    <Screen>
      <View className="flex-row items-center justify-between gap-md px-container-margin pb-md pt-md">
        <View className="flex-1 gap-1">
          <Text className="font-sans-bold text-headline-lg text-on-surface">Candidats</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">
            Faites glisser vos meilleurs profils à travers le pipeline.
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('ComparaisonCandidats')}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-high"
        >
          <MaterialIcons name="compare-arrows" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
        {COLUMNS.map((column) => (
          <View key={column.key} className="w-72 gap-md">
            <View className="flex-row items-center justify-between px-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{column.title}</Text>
                <View className="rounded-full bg-surface-container-highest px-2 py-0.5">
                  <Text className="text-xs font-sans-bold text-on-surface">{column.candidates.length}</Text>
                </View>
              </View>
              <MaterialIcons name="more-horiz" size={18} color={colors.onSurfaceVariant} />
            </View>

            <View className="gap-md">
              {column.candidates.map((candidate) => (
                <Pressable
                  key={candidate.id}
                  onPress={() => navigation.navigate('DetailsCandidat', { name: candidate.name, role: candidate.role, matchScore: candidate.matchScore })}
                  className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-sm"
                >
                  <View className="mb-md flex-row items-start justify-between">
                    <View className="flex-row items-center gap-md">
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Text className="font-sans-bold text-label-lg text-primary">
                          {candidate.name.split(' ').map((n) => n[0]).join('')}
                        </Text>
                      </View>
                      <View>
                        <Text className="font-sans-semibold text-label-lg text-on-surface">{candidate.name}</Text>
                        <Text className="text-xs font-sans text-on-surface-variant">{candidate.role}</Text>
                      </View>
                    </View>
                    <ScoreBadge score={candidate.matchScore} />
                  </View>
                  <Text className="mb-md font-sans text-body-md text-on-surface-variant" numberOfLines={2}>
                    {candidate.summary}
                  </Text>
                  <View className="flex-row items-center justify-between border-t border-outline-variant/30 pt-md">
                    <View className="flex-row gap-1">
                      <Pressable className="rounded-full bg-primary/10 p-2">
                        <MaterialIcons name="mail" size={16} color={colors.primary} />
                      </Pressable>
                      <Pressable
                        className="rounded-full p-2"
                        onPress={() => navigation.navigate('PlanifierEntretien', { candidateName: candidate.name, role: candidate.role })}
                      >
                        <MaterialIcons name="calendar-today" size={16} color={colors.onSurfaceVariant} />
                      </Pressable>
                    </View>
                    <Pressable className="flex-row items-center gap-1 rounded-full bg-primary-container/10 px-md py-2">
                      <Text className="font-sans-semibold text-xs text-primary">Avancer</Text>
                      <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
                    </Pressable>
                  </View>
                </Pressable>
              ))}
              {column.candidates.length === 0 && (
                <View className="items-center rounded-lg border border-dashed border-outline-variant py-lg">
                  <Text className="font-sans text-label-md text-on-surface-variant">Aucun candidat</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
