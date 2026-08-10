import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void; navigate?: (screen: string, params?: any) => void };
  route?: { params?: { testName?: string; score?: number } };
};

const BREAKDOWN = [
  { label: 'Syntaxe & Fondamentaux', score: 95 },
  { label: 'Structures de données', score: 88 },
  { label: 'Frameworks modernes', score: 82 },
];

export default function ResultatsCertificationScreen({ navigation, route }: Props) {
  const testName = route?.params?.testName ?? 'React & React Native';
  const score = route?.params?.score ?? 88;
  const badge = score >= 90 ? 'Expert' : score >= 70 ? 'Confirmé' : 'Débutant';

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Résultats</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View className="items-center gap-md rounded-2xl bg-primary p-lg shadow-lg">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <MaterialIcons name="military-tech" size={36} color="#ffffff" />
          </View>
          <Text className="font-sans-semibold text-title-lg text-white/90">{testName}</Text>
          <Text className="font-sans-extrabold text-display-lg text-white">{score}%</Text>
          <View className="rounded-full bg-white/20 px-3 py-1">
            <Text className="font-sans-bold text-label-md text-white">Badge "{badge}"</Text>
          </View>
        </View>

        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Détail par compétence</Text>
          <View className="gap-md">
            {BREAKDOWN.map((b) => (
              <View key={b.label} className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-medium text-label-lg text-on-surface-variant">{b.label}</Text>
                  <Text className="font-sans-semibold text-label-md text-primary">{b.score}%</Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View className="h-full rounded-full bg-primary/70" style={{ width: `${b.score}%` }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row items-start gap-2 rounded-xl border border-secondary/20 bg-secondary-container/10 p-md">
          <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
          <Text className="flex-1 font-sans text-body-md text-on-surface-variant">
            Ce badge a été ajouté à votre profil public et sera visible par les recruteurs.
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate?.('ProfilPublicCandidat')}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
        >
          <MaterialIcons name="visibility" size={18} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Voir mon profil public</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
