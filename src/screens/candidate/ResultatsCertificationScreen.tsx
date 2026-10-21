import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import { getSkillAssessment, type SkillAssessmentResult } from '../../lib/api';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<CandidateStackParamList, 'ResultatsCertification'>;

export default function ResultatsCertificationScreen({ navigation, route }: Props) {
  const assessmentId = route.params?.assessmentId;
  const [result, setResult] = useState<SkillAssessmentResult | null>(null);
  const [loading, setLoading] = useState(Boolean(assessmentId));
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!assessmentId) { setLoading(false); return; }
    try { setResult(await getSkillAssessment(assessmentId)); }
    catch (err) { setError((err as Error).message || 'Impossible de charger le résultat.'); }
    finally { setLoading(false); }
  }, [assessmentId]);

  useEffect(() => { void load(); }, [load]);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Résultat du test</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? <Text className="font-sans text-body-md text-error">{error}</Text> : !result ? <Text className="font-sans text-body-md text-on-surface-variant">Aucun résultat sélectionné.</Text> : <>
          <View className="items-center gap-md rounded-2xl bg-primary p-lg">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20"><MaterialIcons name="military-tech" size={36} color="#fff" /></View>
            <Text className="font-sans-semibold text-title-lg text-white">{result.test_name}</Text>
            <Text className="font-sans-extrabold text-display-lg text-white">{result.percentage}%</Text>
            <Text className="font-sans-bold text-label-md text-white">Niveau obtenu : {result.badge}</Text>
          </View>
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Résultat enregistré</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">Réponses correctes : {result.score} sur {result.total_questions}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">Date : {new Date(result.created_at).toLocaleString('fr-FR')}</Text>
          </View>
          <View className="flex-row items-start gap-2 rounded-xl border border-tertiary/30 bg-tertiary/10 p-md">
            <MaterialIcons name="info-outline" size={20} color={colors.tertiary} />
            <Text className="flex-1 font-sans text-body-md text-on-surface-variant">Cette évaluation est un résultat interne à EmploiCamer. Elle n’est pas une certification accréditée.</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('TestDeCompetences')} className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-primary">
            <MaterialIcons name="quiz" size={18} color="#fff" /><Text className="font-sans-semibold text-label-lg text-white">Retour aux tests</Text>
          </Pressable>
        </>}
      </ScrollView>
    </View>
  );
}