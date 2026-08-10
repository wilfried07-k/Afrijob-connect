import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'ComparaisonCandidats'>;

const CANDIDATES = [
  { name: 'Jean D.', role: 'Fullstack Dev', color: colors.primary, matchScore: 94, experience: '8 ans', skillsMatched: 9, skillsTotal: 10 },
  { name: 'Sarah M.', role: 'Frontend Expert', color: colors.secondary, matchScore: 88, experience: '6 ans', skillsMatched: 8, skillsTotal: 10 },
];

export default function ComparaisonCandidatsScreen({ navigation }: Props) {
  const [a, b] = CANDIDATES;

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Comparaison</Text>
        <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-primary-container/20">
          <Text className="font-sans-bold text-xs text-primary">GT</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        {/* Selection header */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-label-lg text-outline">Poste : Senior Developer</Text>
            <View className="rounded-full bg-secondary-container/20 px-2 py-1">
              <Text className="font-sans-medium text-label-md text-secondary">2 Candidats</Text>
            </View>
          </View>
          <View className="flex-row gap-md">
            {CANDIDATES.map((c) => (
              <View key={c.name} className="flex-1 items-center gap-2">
                <View className="relative">
                  <View
                    className="h-16 w-16 items-center justify-center rounded-full border-2 bg-surface-container-high"
                    style={{ borderColor: c.color }}
                  >
                    <Text className="font-sans-bold text-title-lg" style={{ color: c.color }}>
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View
                    className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border-2 border-surface"
                    style={{ backgroundColor: c.color }}
                  >
                    <MaterialIcons name="check" size={10} color="#ffffff" />
                  </View>
                </View>
                <View className="items-center">
                  <Text className="font-sans-semibold text-title-lg" style={{ color: c.color }}>
                    {c.name}
                  </Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">{c.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* AI adequacy score */}
        <ComparisonSection icon="auto-awesome" title="Score d'adéquation IA">
          <View className="flex-row">
            <View className="flex-1 items-center py-2">
              <Text className="font-sans-bold text-display-lg" style={{ color: a.color }}>
                {a.matchScore}%
              </Text>
            </View>
            <View className="flex-1 items-center border-l border-outline-variant/30 py-2">
              <Text className="font-sans-bold text-display-lg" style={{ color: b.color }}>
                {b.matchScore}%
              </Text>
            </View>
          </View>
          <View className="h-2 flex-row overflow-hidden rounded-full bg-surface-container-highest">
            <View style={{ width: `${(a.matchScore / (a.matchScore + b.matchScore)) * 100}%`, backgroundColor: a.color }} />
            <View style={{ width: `${(b.matchScore / (a.matchScore + b.matchScore)) * 100}%`, backgroundColor: b.color }} />
          </View>
          <Text className="text-center font-sans text-body-md text-on-surface-variant">
            {a.name} présente une meilleure affinité technique globale.
          </Text>
        </ComparisonSection>

        {/* Experience */}
        <ComparisonSection icon="work" title="Expérience">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">{a.experience}</Text>
            <Text className="font-sans-semibold text-title-lg text-on-surface">{b.experience}</Text>
          </View>
        </ComparisonSection>

        {/* Skills match */}
        <ComparisonSection icon="psychology" title="Compétences requises couvertes">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg" style={{ color: a.color }}>
              {a.skillsMatched}/{a.skillsTotal}
            </Text>
            <Text className="font-sans-semibold text-title-lg" style={{ color: b.color }}>
              {b.skillsMatched}/{b.skillsTotal}
            </Text>
          </View>
        </ComparisonSection>

        {/* Actions */}
        <View className="flex-row gap-md">
          <Pressable
            onPress={() => navigation.navigate('DetailsCandidat', { name: a.name, role: a.role, matchScore: a.matchScore })}
            className="h-12 flex-1 items-center justify-center rounded-full border border-primary"
          >
            <Text className="font-sans-semibold text-label-lg text-primary">Voir {a.name}</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('DetailsCandidat', { name: b.name, role: b.role, matchScore: b.matchScore })}
            className="h-12 flex-1 items-center justify-center rounded-full border border-secondary"
          >
            <Text className="font-sans-semibold text-label-lg text-secondary">Voir {b.name}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function ComparisonSection({
  icon,
  title,
  children,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name={icon} size={18} color={colors.primary} />
        <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-outline">{title}</Text>
      </View>
      {children}
    </View>
  );
}
