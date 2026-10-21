import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { getInterviewReport, type InterviewReport } from '../../lib/api';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'ValidationRapportRH'>;

const recommendationLabel: Record<string, string> = {
  hire: 'Recruter',
  further: 'Entretien supplémentaire',
  reject: 'Ne pas retenir',
};

export default function ValidationRapportRHScreen({ navigation, route }: Props) {
  const interviewId = route.params?.interviewId;
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(Boolean(interviewId));
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!interviewId) { setLoading(false); return; }
    try { setReport(await getInterviewReport(interviewId)); }
    catch (err) { setError((err as Error).message || 'Impossible de charger le rapport.'); }
    finally { setLoading(false); }
  }, [interviewId]);

  useEffect(() => { void load(); }, [load]);

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Rapport d’entretien</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        <View className="items-center gap-2 rounded-xl bg-secondary-container p-lg">
          <MaterialIcons name="check-circle" size={42} color={colors.secondary} />
          <Text className="font-sans-semibold text-title-lg text-on-secondary-container">{report?.status === 'Soumis' ? 'Rapport soumis' : report?.status ?? 'Rapport'}</Text>
          <Text className="text-center font-sans text-body-md text-on-surface-variant">{report ? 'Le rapport est enregistré dans le dossier de cet entretien.' : 'Le rapport soumis apparaîtra ici.'}</Text>
        </View>
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? <Text className="font-sans text-body-md text-error">{error}</Text> : !interviewId || !report ? <Text className="font-sans text-body-md text-on-surface-variant">Aucun rapport soumis n’est associé à cet entretien.</Text> : <>
          <View className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
            <Text className="font-sans-semibold text-title-lg text-on-surface">{route.params?.candidateName ?? 'Candidat'}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">{route.params?.role ?? 'Entretien'}</Text>
            <Text className="mt-2 font-sans text-label-md text-on-surface-variant">Mis à jour le {new Date(report.updated_at).toLocaleString('fr-FR')}</Text>
          </View>
          <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Évaluation</Text>
            <Score label="Compétences techniques" value={report.technical_rating} />
            <Score label="Communication" value={report.communication_rating} />
            <Score label="Compétences relationnelles" value={report.soft_skills_rating} />
            <Text className="font-sans-semibold text-label-lg text-primary">Recommandation : {recommendationLabel[report.recommendation ?? ''] ?? 'Non renseignée'}</Text>
            {report.impressions ? <Text className="font-sans text-body-md text-on-surface-variant">{report.impressions}</Text> : null}
            {report.notes ? <Text className="font-sans text-body-md text-on-surface-variant">Notes : {report.notes}</Text> : null}
            {report.positives ? <Text className="font-sans text-body-md text-on-surface-variant">Points positifs : {report.positives}</Text> : null}
            {report.concerns ? <Text className="font-sans text-body-md text-on-surface-variant">Vigilance : {report.concerns}</Text> : null}
          </View>
          <Text className="font-sans text-label-md text-on-surface-variant">Cette version ne comprend pas de circuit de validation RH distinct.</Text>
        </>}
        <Pressable onPress={() => navigation.navigate('GestionEntretiensVideo')} className="h-12 flex-row items-center justify-center gap-2 rounded-lg border border-primary">
          <MaterialIcons name="event" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Retour aux entretiens</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function Score({ label, value }: { label: string; value?: number | null }) {
  return <View className="flex-row items-center justify-between"><Text className="font-sans text-body-md text-on-surface-variant">{label}</Text><View className="flex-row items-center gap-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{value ?? '—'}</Text><Text className="font-sans text-label-md text-outline">/ 5</Text></View></View>;
}