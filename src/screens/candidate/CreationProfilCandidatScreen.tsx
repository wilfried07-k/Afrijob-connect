import { useState } from 'react';
import { Alert, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { upsertCandidateProfile } from '../../lib/api';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CreationProfilCandidat'>;

export default function CreationProfilCandidatScreen({ navigation }: Props) {
  const { authState, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(authState.profile?.full_name ?? '');
  const [jobTitle, setJobTitle] = useState(authState.profile?.job_title ?? '');
  const [city, setCity] = useState(authState.profile?.city ?? '');
  const [summary, setSummary] = useState(authState.profile?.summary ?? '');
  const [saving, setSaving] = useState(false);
  const completion = Math.round(
    [fullName, jobTitle, city, summary].filter((value) => value.trim().length > 0).length * 25,
  );

  const saveProfile = async () => {
    if (!authState.userId) {
      Alert.alert('Connexion requise', 'Connectez-vous pour enregistrer votre profil.');
      return;
    }
    setSaving(true);
    try {
      await upsertCandidateProfile({
        user_id: authState.userId,
        full_name: fullName.trim(),
        job_title: jobTitle.trim(),
        city: city.trim(),
        summary: summary.trim(),
      });
      await refreshProfile();
      Alert.alert('Profil enregistré', 'Vos informations ont été mises à jour.', [
        { text: 'Continuer', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible d’enregistrer le profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-lg-mobile text-primary">Mon Profil</Text>
        <View className="items-center">
          <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-secondary-container">
            <Text className="font-sans-bold text-xs text-secondary">{completion}%</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        {/* Avatar */}
        <View className="items-center gap-md">
          <View className="relative">
            <View className="h-32 w-32 items-center justify-center rounded-2xl bg-surface-container-low shadow-lg ring-4 ring-white">
              <Text className="font-sans-bold text-display-lg text-primary">{fullName.trim().slice(0, 2).toUpperCase() || '?'}</Text>
            </View>
            <Pressable className="absolute -bottom-2 -right-2 rounded-xl bg-primary p-2.5 shadow-lg">
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </Pressable>
          </View>
          <View className="items-center">
            <Text className="font-sans-bold text-title-lg text-on-surface">Profil candidat</Text>
            <Text className="font-sans text-body-md text-outline">
              Modifiez votre photo pour attirer plus de recruteurs
            </Text>
          </View>
        </View>

        {/* Score */}
        <View className="rounded-lg border border-outline-variant/30 bg-white p-md shadow-sm">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-sans-semibold text-label-lg text-on-surface">Force du profil</Text>
            <Text className="font-sans-bold text-label-lg text-secondary">{completion}%</Text>
          </View>
          <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <View className="h-full rounded-full bg-secondary" style={{ width: `${completion}%` }} />
          </View>
          <Text className="mt-2 font-sans text-xs italic text-outline">
            Ajoutez votre expérience pour atteindre 70%
          </Text>
        </View>

        {/* Basic info */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="person" size={20} color={colors.primary} />
            <Text className="font-sans-bold text-title-lg text-on-surface">Informations de base</Text>
          </View>

          <View className="gap-1">
            <Text className="ml-1 font-sans-bold text-xs uppercase text-outline">Nom complet</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              className="rounded-xl border border-outline-variant bg-white px-4 py-3 font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="ml-1 font-sans-bold text-xs uppercase text-outline">Titre du poste</Text>
            <TextInput
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="ex: Développeur Fullstack React"
              placeholderTextColor={colors.outline}
              className="rounded-xl border border-outline-variant bg-white px-4 py-3 font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="ml-1 font-sans-bold text-xs uppercase text-outline">Ville</Text>
            <View className="flex-row items-center rounded-xl border border-outline-variant bg-white px-4">
              <MaterialIcons name="location-on" size={18} color={colors.outline} />
              <TextInput
                value={city}
                onChangeText={setCity}
                className="ml-2 flex-1 py-3 font-sans text-body-md text-on-surface"
              />
            </View>
          </View>
        </View>

        {/* Summary */}
        <View className="gap-md">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="description" size={20} color={colors.primary} />
            <Text className="font-sans-bold text-title-lg text-on-surface">Résumé professionnel</Text>
          </View>
          <TextInput
            value={summary}
            onChangeText={setSummary}
            placeholder="Présentez votre parcours et vos compétences clés en quelques phrases..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-[120px] rounded-xl border border-outline-variant bg-white p-4 font-sans text-body-md text-on-surface"
          />
        </View>

        <Button label={saving ? 'Enregistrement…' : 'Enregistrer mon profil'} disabled={saving} onPress={saveProfile} />
      </ScrollView>
    </Screen>
  );
}
