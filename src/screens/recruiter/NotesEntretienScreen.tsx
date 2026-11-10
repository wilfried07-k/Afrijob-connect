import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { getInterviewReport, saveInterviewReport } from '../../lib/api';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'NotesEntretien'>;

export default function NotesEntretienScreen({ navigation, route }: Props) {
  const interviewId = route.params?.interviewId;
  const candidateName = route.params?.candidateName ?? 'Candidat';
  const role = route.params?.role ?? 'Entretien';
  const [notes, setNotes] = useState('');
  const [positives, setPositives] = useState('');
  const [concerns, setConcerns] = useState('');
  const [loading, setLoading] = useState(Boolean(interviewId));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!interviewId) { setLoading(false); return; }
    try {
      const report = await getInterviewReport(interviewId);
      if (report) { setNotes(report.notes ?? ''); setPositives(report.positives ?? ''); setConcerns(report.concerns ?? ''); }
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de charger les notes.'); }
    finally { setLoading(false); }
  }, [interviewId]);

  useEffect(() => { void load(); }, [load]);

  const saveDraft = async () => {
    if (!interviewId) { Alert.alert('Entretien manquant', 'Ouvre les notes depuis un entretien planifié.'); return false; }
    setSaving(true);
    try {
      await saveInterviewReport(interviewId, { notes, positives, concerns, status: 'Brouillon' });
      return true;
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible d’enregistrer le brouillon.'); return false; }
    finally { setSaving(false); }
  };

  const openReport = async () => {
    if (await saveDraft()) navigation.navigate('RedactionRapportEntretien', { interviewId, candidateName, role });
  };

  return (
    <Screen>
      <View className="h-14 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Notes d’entretien</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        <View className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
          <Text className="font-sans-semibold text-title-lg text-on-surface">{role}</Text>
          <Text className="font-sans text-body-md text-on-surface-variant">{candidateName}</Text>
        </View>
        {!interviewId ? <Text className="font-sans text-body-md text-error">Aucun entretien n’est associé. Reviens à la liste et ouvre les notes depuis un entretien.</Text> : loading ? <ActivityIndicator color={colors.primary} /> : <>
          <Field label="Notes d’entretien" value={notes} onChangeText={setNotes} placeholder="Notes prises pendant l’entretien" />
          <Field label="Points positifs" value={positives} onChangeText={setPositives} placeholder="Forces observées" />
          <Field label="Points de vigilance" value={concerns} onChangeText={setConcerns} placeholder="Points à approfondir" />
          <Pressable disabled={saving} onPress={() => void saveDraft()} className="h-12 flex-row items-center justify-center gap-2 rounded-lg border border-primary">
            {saving ? <ActivityIndicator color={colors.primary} /> : <><MaterialIcons name="save" size={18} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-primary">Enregistrer le brouillon</Text></>}
          </Pressable>
          <Pressable disabled={saving} onPress={() => void openReport()} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary">
            <MaterialIcons name="edit-note" size={20} color="#fff" /><Text className="font-sans-semibold text-title-lg text-white">Continuer vers l’évaluation</Text>
          </Pressable>
        </>}
      </ScrollView>
    </Screen>
  );
}

function Field({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface">{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.outline} multiline textAlignVertical="top" className="min-h-[110px] rounded-xl border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface" /></View>;
}