import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { createCareerExperience, deleteCareerExperience, listCareerExperiences, type CareerExperience } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };

export default function ReleveCarriereScreen({ navigation }: Props) {
  const [items, setItems] = useState<CareerExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employer, setEmployer] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setItems(await listCareerExperiences()); }
    catch (err) { setError((err as Error).message || 'Impossible de charger les expériences.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    if (!employer.trim() || !jobTitle.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      Alert.alert('Informations requises', 'Renseigne l’employeur, le poste et une date de début au format AAAA-MM-JJ.');
      return;
    }
    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      Alert.alert('Date incorrecte', 'La date de fin doit suivre le format AAAA-MM-JJ.');
      return;
    }
    setSaving(true);
    try {
      const item = await createCareerExperience({
        employer: employer.trim(),
        job_title: jobTitle.trim(),
        start_date: new Date(startDate + 'T00:00:00').toISOString(),
        end_date: endDate ? new Date(endDate + 'T00:00:00').toISOString() : undefined,
        description: description.trim() || undefined,
      });
      setItems((current) => [item, ...current].sort((a, b) => b.start_date.localeCompare(a.start_date)));
      setEmployer(''); setJobTitle(''); setStartDate(''); setEndDate(''); setDescription('');
      Alert.alert('Expérience enregistrée', 'Cette expérience a été ajoutée à ton historique personnel.');
    } catch (err) { Alert.alert('Erreur', (err as Error).message || 'Impossible d’enregistrer cette expérience.'); }
    finally { setSaving(false); }
  };

  const remove = (item: CareerExperience) => Alert.alert(
    'Supprimer cette expérience ?',
    item.employer + ' · ' + item.job_title,
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try { await deleteCareerExperience(item.id); setItems((current) => current.filter((entry) => entry.id !== item.id)); }
        catch (err) { Alert.alert('Erreur', (err as Error).message || 'Impossible de supprimer cette expérience.'); }
      } },
    ],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Mon expérience professionnelle</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 36 }}>
        <View className="flex-row items-start gap-2 rounded-xl border border-tertiary/30 bg-tertiary/10 p-md">
          <MaterialIcons name="info-outline" size={20} color={colors.tertiary} />
          <Text className="flex-1 font-sans text-label-lg text-on-surface-variant">
            Cet historique est saisi par toi et n’est pas un relevé officiel CNPS. Les cotisations, le matricule assuré et les droits à pension nécessitent une connexion aux services de la CNPS.
          </Text>
        </View>
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Ajouter une expérience</Text>
          <TextInput value={employer} onChangeText={setEmployer} placeholder="Employeur" placeholderTextColor={colors.outline} className="rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          <TextInput value={jobTitle} onChangeText={setJobTitle} placeholder="Poste occupé" placeholderTextColor={colors.outline} className="rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          <TextInput value={startDate} onChangeText={setStartDate} placeholder="Date de début (AAAA-MM-JJ)" placeholderTextColor={colors.outline} autoCapitalize="none" className="rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          <TextInput value={endDate} onChangeText={setEndDate} placeholder="Date de fin (facultative, AAAA-MM-JJ)" placeholderTextColor={colors.outline} autoCapitalize="none" className="rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          <TextInput value={description} onChangeText={setDescription} placeholder="Description (facultative)" placeholderTextColor={colors.outline} multiline textAlignVertical="top" className="min-h-[90px] rounded-lg border border-outline-variant p-md font-sans text-body-md text-on-surface" />
          <Pressable disabled={saving} onPress={() => void submit()} className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary">
            {saving ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="add" size={20} color="#fff" /><Text className="font-sans-semibold text-label-lg text-white">Enregistrer l’expérience</Text></>}
          </Pressable>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Historique enregistré</Text>
          <Pressable onPress={() => void load()} hitSlop={8}><MaterialIcons name="refresh" size={20} color={colors.primary} /></Pressable>
        </View>
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? <Text className="font-sans text-body-md text-error">{error}</Text> : items.length === 0 ? <Text className="rounded-lg bg-surface-container p-md font-sans text-body-md text-on-surface-variant">Aucune expérience ajoutée pour le moment.</Text> : items.map((item) => (
          <View key={item.id} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md">
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{item.job_title}</Text>
                <Text className="font-sans text-body-md text-on-surface-variant">{item.employer}</Text>
              </View>
              <Pressable onPress={() => remove(item)} hitSlop={8}><MaterialIcons name="delete-outline" size={20} color={colors.error} /></Pressable>
            </View>
            <Text className="font-sans text-label-md text-on-surface-variant">
              {new Date(item.start_date).toLocaleDateString('fr-FR')} – {item.end_date ? new Date(item.end_date).toLocaleDateString('fr-FR') : 'En cours'}
            </Text>
            {item.description ? <Text className="font-sans text-body-md text-on-surface-variant">{item.description}</Text> : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}