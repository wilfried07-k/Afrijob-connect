import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { getInterviewReport, saveInterviewReport } from '../../lib/api';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'RedactionRapportEntretien'>;
type Recommendation = 'hire' | 'further' | 'reject';
const SKILLS = [
  { key: 'technical_rating' as const, label: 'Compétences techniques' },
  { key: 'communication_rating' as const, label: 'Communication' },
  { key: 'soft_skills_rating' as const, label: 'Compétences relationnelles' },
];

export default function RedactionRapportEntretienScreen({ navigation, route }: Props) {
  const interviewId = route.params?.interviewId;
  const candidateName = route.params?.candidateName ?? 'Candidat';
  const role = route.params?.role ?? 'Entretien';
  const [ratings, setRatings] = useState({ technical_rating: 0, communication_rating: 0, soft_skills_rating: 0 });
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [impressions, setImpressions] = useState('');
  const [loading, setLoading] = useState(Boolean(interviewId));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!interviewId) { setLoading(false); return; }
    try {
      const report = await getInterviewReport(interviewId);
      if (report) {
        setRatings({ technical_rating: report.technical_rating ?? 0, communication_rating: report.communication_rating ?? 0, soft_skills_rating: report.soft_skills_rating ?? 0 });
        setRecommendation(report.recommendation ?? null);
        setImpressions(report.impressions ?? '');
      }
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de charger le rapport.'); }
    finally { setLoading(false); }
  }, [interviewId]);

  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    if (!interviewId) { Alert.alert('Entretien manquant', 'Ouvre ce rapport depuis un entretien planifié.'); return; }
    if (Object.values(ratings).some((value) => value < 1) || !recommendation) {
      Alert.alert('Évaluation incomplète', 'Note les trois critères et choisis une recommandation.');
      return;
    }
    setSaving(true);
    try {
      await saveInterviewReport(interviewId, { ...ratings, recommendation, impressions, status: 'Soumis' });
      navigation.navigate('ValidationRapportRH', { interviewId, candidateName, role });
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de soumettre le rapport.'); }
    finally { setSaving(false); }
  };

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Évaluation d’entretien</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 36 }}>
        <View className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
          <Text className="font-sans-semibold text-title-lg text-on-surface">{candidateName}</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">{role}</Text>
        </View>
        {!interviewId ? <Text className="font-sans text-body-md text-error">Aucun entretien associé à ce rapport.</Text> : loading ? <ActivityIndicator color={colors.primary} /> : <>
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
            {SKILLS.map((skill) => <View key={skill.key} className="gap-2">
              <Text className="font-sans-medium text-label-lg text-on-surface-variant">{skill.label}</Text>
              <View className="flex-row gap-1">{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setRatings((current) => ({ ...current, [skill.key]: value }))} hitSlop={5}><MaterialIcons name={value <= ratings[skill.key] ? 'star' : 'star-border'} size={26} color={colors.tertiary} /></Pressable>)}</View>
            </View>)}
          </View>
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Impressions générales</Text>
            <TextInput value={impressions} onChangeText={setImpressions} placeholder="Commentaire du recruteur" placeholderTextColor={colors.outline} multiline textAlignVertical="top" className="min-h-[110px] rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          </View>
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Recommandation</Text>
            {([
              ['hire', 'Recruter'],
              ['further', 'Entretien supplémentaire'],
              ['reject', 'Ne pas retenir'],
            ] as [Recommendation, string][]).map(([value, label]) => <Pressable key={value} onPress={() => setRecommendation(value)} className={'rounded-lg border p-md ' + (recommendation === value ? 'border-primary bg-primary/10' : 'border-outline-variant')}>
              <Text className="font-sans-semibold text-label-lg text-on-surface">{label}</Text>
            </Pressable>)}
          </View>
          <Pressable disabled={saving} onPress={() => void submit()} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary">
            {saving ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="send" size={18} color="#fff" /><Text className="font-sans-semibold text-title-lg text-white">Soumettre le rapport</Text></>}
          </Pressable>
        </>}
      </ScrollView>
    </Screen>
  );
}