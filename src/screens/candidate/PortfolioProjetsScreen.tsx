import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { createPortfolioProject, deletePortfolioProject, listMyPortfolioProjects, type CandidatePortfolioProject } from '../../lib/api';
import { useAuth } from '../../lib/auth';

type Props = { navigation: { goBack: () => void } };

export default function PortfolioProjetsScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const [projects, setProjects] = useState<CandidatePortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setProjects(await listMyPortfolioProjects()); }
    catch (err) { setError((err as Error).message || 'Impossible de charger le portfolio.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    if (!authState.profile?.candidate_profile_id) { Alert.alert('Profil candidat requis', 'Complète ton profil candidat avant d’ajouter un projet.'); return; }
    if (!title.trim() || !description.trim()) { Alert.alert('Informations requises', 'Le titre et la description sont obligatoires.'); return; }
    setSaving(true);
    try {
      const project = await createPortfolioProject({
        title: title.trim(),
        description: description.trim(),
        skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        url: url.trim() || undefined,
      });
      setProjects((current) => [project, ...current]);
      setTitle(''); setDescription(''); setSkills(''); setUrl(''); setShowForm(false);
      Alert.alert('Projet enregistré', 'Le projet est maintenant dans ton portfolio.');
    } catch (err) { Alert.alert('Erreur', (err as Error).message || 'Impossible d’enregistrer le projet.'); }
    finally { setSaving(false); }
  };

  const remove = (project: CandidatePortfolioProject) => Alert.alert('Supprimer ce projet ?', project.title, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: async () => {
      try { await deletePortfolioProject(project.id); setProjects((current) => current.filter((item) => item.id !== project.id)); }
      catch (err) { Alert.alert('Erreur', (err as Error).message || 'Impossible de supprimer ce projet.'); }
    } },
  ]);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <View className="flex-row items-center gap-3"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Mon portfolio</Text></View>
        <Pressable onPress={() => setShowForm((value) => !value)} className="h-10 w-10 items-center justify-center rounded-full bg-primary"><MaterialIcons name={showForm ? 'close' : 'add'} size={20} color="#fff" /></Pressable>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        {showForm ? <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Ajouter un projet</Text>
          <Field label="Titre *" value={title} onChangeText={setTitle} placeholder="Nom du projet" />
          <Field label="Description *" value={description} onChangeText={setDescription} placeholder="Ce que tu as réalisé" multiline />
          <Field label="Compétences (séparées par des virgules)" value={skills} onChangeText={setSkills} placeholder="React, Python, UX" />
          <Field label="Lien public (facultatif)" value={url} onChangeText={setUrl} placeholder="https://..." />
          <Pressable disabled={saving} onPress={() => void save()} className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary">
            {saving ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="save" size={18} color="#fff" /><Text className="font-sans-semibold text-label-lg text-white">Enregistrer le projet</Text></>}
          </Pressable>
        </View> : null}
        {loading ? <ActivityIndicator color={colors.primary} /> : error ? <View className="gap-2"><Text className="font-sans text-body-md text-error">{error}</Text><Pressable onPress={() => void load()}><Text className="font-sans-semibold text-label-lg text-primary">Réessayer</Text></Pressable></View> : projects.length === 0 ? <View className="items-center gap-md py-xl"><MaterialIcons name="collections-bookmark" size={48} color={colors.outline} /><Text className="font-sans text-body-md text-on-surface-variant">Aucun projet enregistré. Ajoute ton premier projet.</Text></View> : projects.map((project) => (
          <View key={project.id} className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
            <View className="flex-row items-start justify-between gap-2"><Text className="flex-1 font-sans-semibold text-title-lg text-on-surface">{project.title}</Text><Pressable onPress={() => remove(project)} hitSlop={8}><MaterialIcons name="delete-outline" size={21} color={colors.error} /></Pressable></View>
            <Text className="font-sans text-body-md text-on-surface-variant">{project.description}</Text>
            {project.skills ? <View className="flex-row flex-wrap gap-2">{project.skills.split(',').map((skill) => <View key={skill} className="rounded-full bg-primary/10 px-3 py-1"><Text className="font-sans-medium text-label-md text-primary">{skill}</Text></View>)}</View> : null}
            {project.url ? <Pressable onPress={() => void Linking.openURL(project.url!)} className="flex-row items-center gap-2"><MaterialIcons name="open-in-new" size={16} color={colors.primary} /><Text className="flex-1 font-sans text-label-md text-primary">{project.url}</Text></Pressable> : null}
            <Text className="font-sans text-label-md text-outline">Ajouté le {new Date(project.created_at).toLocaleDateString('fr-FR')}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean }) {
  return <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.outline} multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} className={'rounded-lg border border-outline px-md py-3 font-sans text-body-md text-on-surface ' + (multiline ? 'min-h-[100px]' : 'h-12')} /></View>;
}