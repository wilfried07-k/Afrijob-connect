import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import { listMySkillAssessments, listSkillAssessmentTests, submitSkillAssessment, type SkillAssessmentResult, type SkillAssessmentTest } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'TestDeCompetences'>;

export default function TestDeCompetencesScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const [tests, setTests] = useState<SkillAssessmentTest[]>([]);
  const [results, setResults] = useState<SkillAssessmentResult[]>([]);
  const [activeTest, setActiveTest] = useState<SkillAssessmentTest | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const testData = await listSkillAssessmentTests();
      setTests(testData);
      if (authState.profile?.candidate_profile_id) setResults(await listMySkillAssessments());
      else setResults([]);
    } catch (err) { setError((err as Error).message || 'Impossible de charger les tests.'); }
    finally { setLoading(false); }
  }, [authState.profile?.candidate_profile_id]);

  useEffect(() => { void load(); }, [load]);

  const start = (test: SkillAssessmentTest) => {
    if (!authState.profile?.candidate_profile_id) { Alert.alert('Profil candidat requis', 'Complète ton profil candidat avant de passer un test.'); return; }
    setActiveTest(test); setQuestionIndex(0); setAnswers({});
  };

  const submit = async () => {
    if (!activeTest || activeTest.questions.some((question) => answers[question.id] === undefined)) {
      Alert.alert('Test incomplet', 'Réponds à chaque question avant de terminer.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitSkillAssessment({
        test_id: activeTest.id,
        answers: activeTest.questions.map((question) => ({ question_id: question.id, selected_option: answers[question.id] })),
      });
      setResults((current) => [result, ...current]);
      setActiveTest(null);
      navigation.navigate('ResultatsCertification', { assessmentId: result.id });
    } catch (err) { Alert.alert('Erreur', (err as Error).message || 'Impossible d’enregistrer le résultat.'); }
    finally { setSubmitting(false); }
  };

  if (activeTest) {
    const question = activeTest.questions[questionIndex];
    return (
      <Screen>
        <View className="h-16 flex-row items-center gap-3 px-container-margin">
          <Pressable onPress={() => setActiveTest(null)} hitSlop={8}><MaterialIcons name="close" size={24} color={colors.primary} /></Pressable>
          <Text className="font-sans-bold text-headline-md text-primary">{activeTest.name}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
          <Text className="font-sans text-label-lg text-on-surface-variant">Question {questionIndex + 1} / {activeTest.questions.length}</Text>
          <View className="h-2 overflow-hidden rounded-full bg-surface-container-high"><View className="h-full rounded-full bg-primary" style={{ width: `${(100 * (questionIndex + 1)) / activeTest.questions.length}%` as any }} /></View>
          <Text className="font-sans-semibold text-headline-md text-on-surface">{question.prompt}</Text>
          {question.options.map((option, index) => {
            const selected = answers[question.id] === index;
            return <Pressable key={index} onPress={() => setAnswers((current) => ({ ...current, [question.id]: index }))} className={'rounded-xl border p-md ' + (selected ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container-lowest')}>
              <Text className="font-sans text-body-md text-on-surface">{option}</Text>
            </Pressable>;
          })}
          {questionIndex < activeTest.questions.length - 1 ? (
            <Pressable disabled={answers[question.id] === undefined} onPress={() => setQuestionIndex((index) => index + 1)} className="h-12 items-center justify-center rounded-lg bg-primary">
              <Text className="font-sans-semibold text-label-lg text-white">Question suivante</Text>
            </Pressable>
          ) : (
            <Pressable disabled={submitting || answers[question.id] === undefined} onPress={() => void submit()} className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary">
              {submitting ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="check" size={18} color="#fff" /><Text className="font-sans-semibold text-label-lg text-white">Terminer et voir le résultat</Text></>}
            </Pressable>
          )}
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Évaluations de compétences</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        <View className="flex-row items-start gap-2 rounded-xl border border-tertiary/30 bg-tertiary/10 p-md">
          <MaterialIcons name="info-outline" size={20} color={colors.tertiary} />
          <Text className="flex-1 font-sans text-label-lg text-on-surface-variant">Ces quiz mesurent tes réponses à quelques questions et génèrent un résultat interne à EmploiCamer. Ils ne remplacent pas une certification professionnelle.</Text>
        </View>
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? <Text className="font-sans text-body-md text-error">{error}</Text> : <>
          {results.length > 0 ? <View className="gap-md">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Mes résultats</Text>
            {results.map((result) => <Pressable key={result.id} onPress={() => navigation.navigate('ResultatsCertification', { assessmentId: result.id })} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
              <MaterialIcons name="military-tech" size={24} color={colors.tertiary} />
              <View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{result.test_name}</Text><Text className="font-sans text-label-md text-on-surface-variant">{new Date(result.created_at).toLocaleDateString('fr-FR')} · {result.badge}</Text></View>
              <Text className="font-sans-bold text-title-lg text-primary">{result.percentage}%</Text>
            </Pressable>)}
          </View> : null}
          <Text className="font-sans-semibold text-title-lg text-on-surface">Tests disponibles</Text>
          {tests.map((test) => <View key={test.id} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
            <View className="flex-row items-center gap-md"><MaterialIcons name="quiz" size={22} color={colors.primary} /><View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{test.name}</Text><Text className="font-sans text-label-md text-on-surface-variant">{test.questions.length} questions · correction enregistrée au serveur</Text></View></View>
            <Pressable onPress={() => start(test)} className="h-10 items-center justify-center rounded-lg bg-primary-container"><Text className="font-sans-semibold text-label-lg text-on-primary-container">Commencer</Text></Pressable>
          </View>)}
        </>}
      </ScrollView>
    </Screen>
  );
}