import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'RedactionRapportEntretien'>;

type SkillKey = 'tech' | 'comm' | 'soft';
type Recommendation = 'hire' | 'further' | 'reject';

const SKILLS: { key: SkillKey; label: string }[] = [
  { key: 'tech', label: 'Compétences Techniques' },
  { key: 'comm', label: 'Communication' },
  { key: 'soft', label: 'Soft Skills' },
];

const RECOMMENDATIONS: { key: Recommendation; title: string; subtitle: string; color: string }[] = [
  { key: 'hire', title: 'Recruter', subtitle: 'Profil idéal pour le poste', color: colors.primary },
  { key: 'further', title: 'Entretien Supplémentaire', subtitle: 'Besoin de valider certains points', color: colors.onSurface },
  { key: 'reject', title: 'Rejeter', subtitle: 'Ne correspond pas aux attentes', color: colors.error },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View className="flex-row gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => onChange(i)} hitSlop={4}>
          <MaterialIcons name={i <= value ? 'star' : 'star-border'} size={26} color={i <= value ? colors.tertiary : colors.outlineVariant} />
        </Pressable>
      ))}
    </View>
  );
}

export default function RedactionRapportEntretienScreen({ navigation, route }: Props) {
  const candidateName = route.params?.candidateName ?? 'Jean-Paul Nkou';
  const role = route.params?.role ?? 'Lead Frontend Developer';

  const [ratings, setRatings] = useState<Record<SkillKey, number>>({ tech: 0, comm: 0, soft: 0 });
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [impressions, setImpressions] = useState('');

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Rapport d'entretien</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Candidate header */}
        <View className="items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary-fixed bg-primary/10">
            <Text className="font-sans-bold text-title-lg text-primary">
              {candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
          <Text className="font-sans-bold text-headline-md text-on-surface">{candidateName}</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">{role}</Text>
          <View className="flex-row gap-2">
            <View className="rounded-full bg-surface-container-high px-3 py-1">
              <Text className="font-sans text-label-md text-on-surface-variant">Hier, 14:30</Text>
            </View>
            <View className="rounded-full bg-secondary-container px-3 py-1">
              <Text className="font-sans text-label-md text-on-secondary-container">Session vidéo</Text>
            </View>
          </View>
        </View>

        {/* Competencies */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="insights" size={20} color={colors.primary} />
            <Text className="font-sans-semibold text-title-lg text-on-surface">Compétences</Text>
          </View>
          {SKILLS.map((skill) => (
            <View key={skill.key} className="gap-1">
              <Text className="font-sans-medium text-label-lg text-on-surface-variant">{skill.label}</Text>
              <StarRating
                value={ratings[skill.key]}
                onChange={(v) => setRatings((r) => ({ ...r, [skill.key]: v }))}
              />
            </View>
          ))}
        </View>

        {/* Comments */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="edit-note" size={20} color={colors.primary} />
            <Text className="font-sans-semibold text-title-lg text-on-surface">Commentaires du recruteur</Text>
          </View>
          <Text className="font-sans-medium text-label-lg text-on-surface-variant">Impressions Générales</Text>
          <TextInput
            value={impressions}
            onChangeText={setImpressions}
            placeholder="Décrivez votre ressenti général sur ce candidat..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-[120px] rounded-xl border border-outline-variant bg-surface p-md font-sans text-body-md text-on-surface"
          />
        </View>

        {/* Recommendation */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Recommandation Finale</Text>
          <View className="gap-2">
            {RECOMMENDATIONS.map((rec) => {
              const active = recommendation === rec.key;
              return (
                <Pressable
                  key={rec.key}
                  onPress={() => setRecommendation(rec.key)}
                  className={`rounded-xl border p-md ${active ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}
                >
                  <Text className="font-sans-semibold text-label-lg" style={{ color: active ? colors.primary : rec.color }}>
                    {rec.title}
                  </Text>
                  <Text className="text-xs font-sans text-on-surface-variant">{rec.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          disabled={!recommendation}
          onPress={() => navigation.navigate('ValidationRapportRH', { candidateName, role })}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${!recommendation ? 'opacity-40' : ''}`}
        >
          <MaterialIcons name="send" size={18} color="#ffffff" />
          <Text className="font-sans-semibold text-title-lg text-on-primary">Soumettre le rapport</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
