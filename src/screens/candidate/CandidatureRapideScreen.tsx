import { useState } from 'react';
import { Alert, View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { applyToJob } from '../../lib/api';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CandidatureRapide'>;

export default function CandidatureRapideScreen({ navigation, route }: Props) {
  const title = route.params?.title ?? 'Offre sélectionnée';
  const company = route.params?.company ?? 'Entreprise';
  const jobId = route.params?.jobId;
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const displayInitial = authState.profile?.full_name?.trim()?.[0]?.toUpperCase() ?? '?';
  const [message, setMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!acceptedTerms || !candidateId || !jobId) return;
    setSubmitting(true);
    try {
      await applyToJob({ candidate_id: candidateId, job_offer_id: jobId, motivation_message: message || undefined });
      navigation.replace('CandidatureEnvoyee', { company });
    } catch (err) {
      Alert.alert('Candidature non envoyée', (err as Error).message || 'Réessaie plus tard.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <View className="h-16 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-semibold text-title-lg text-primary">Postuler · {title}</Text>
        <View className="w-6" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Review info */}
        <View className="gap-md">
          <Text className="px-1 font-sans-semibold text-headline-md text-on-surface">
            Révision des informations
          </Text>
          <View className="flex-row items-center gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary-container bg-surface-variant">
              <Text className="font-sans-bold text-title-lg text-primary">{displayInitial}</Text>
            </View>
            <View>
              <Text className="font-sans-semibold text-title-lg text-on-surface">{authState.profile?.full_name || "Complète ton profil candidat"}</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">{authState.profile?.job_title || title}</Text>
            </View>
          </View>
          <View className="flex-row gap-md">
            <View className="flex-1 gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-md">
              <Text className="font-sans-semibold text-[11px] uppercase tracking-wider text-primary">Email</Text>
              <Text className="font-sans text-body-md text-on-surface">{authState.profile?.email || "Email du compte indisponible"}</Text>
            </View>
            <View className="flex-1 gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-md">
              <Text className="font-sans-semibold text-[11px] uppercase tracking-wider text-primary">Téléphone</Text>
              <Text className="font-sans text-body-md text-on-surface">{authState.profile?.phone || "Téléphone non renseigné"}</Text>
            </View>
          </View>
        </View>

        <View className="gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
          <View className="flex-row items-start gap-3">
            <MaterialIcons name="person-outline" size={22} color={colors.primary} />
            <View className="flex-1 gap-1">
              <Text className="font-sans-semibold text-title-lg text-on-surface">Profil transmis avec la candidature</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">La gestion et la pièce jointe de CV ne sont pas encore disponibles. Vérifie tes coordonnées avant l’envoi.</Text>
            </View>
          </View>
          <Pressable onPress={() => navigation.navigate('CreationProfilCandidat')} className="self-start py-2"><Text className="font-sans-semibold text-label-lg text-primary">Vérifier mon profil</Text></Pressable>
        </View>
        {/* Message */}
        <View className="gap-md">
          <Text className="px-1 font-sans-semibold text-headline-md text-on-surface">
            Message de motivation (optionnel)
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={`Expliquez pourquoi vous êtes fait(e) pour ce poste chez ${company}...`}
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] rounded-lg border border-outline-variant bg-surface-container-lowest p-md font-sans text-body-md text-on-surface"
          />
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View className="gap-md border-t border-outline-variant px-container-margin py-md">
        <Pressable className="flex-row items-start gap-2" onPress={() => setAcceptedTerms((v) => !v)}>
          <View
            className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              acceptedTerms ? 'border-primary bg-primary' : 'border-outline'
            }`}
          >
            {acceptedTerms && <MaterialIcons name="check" size={14} color="#ffffff" />}
          </View>
          <Text className="flex-1 font-sans text-label-md leading-tight text-on-surface-variant">
            J'autorise EmploiCamer à transmettre mes coordonnées et mon profil à {company} conformément à
            la politique de confidentialité.
          </Text>
        </Pressable>
        <Pressable
          disabled={!acceptedTerms || submitting || !jobId || !candidateId}
          onPress={handleSubmit}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
            !acceptedTerms || submitting || !jobId || !candidateId ? 'opacity-50' : ''
          }`}
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer ma candidature</Text>
          <MaterialIcons name="send" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}
