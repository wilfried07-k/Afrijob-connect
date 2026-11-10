import { useState } from 'react';
import { Alert, View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CandidateStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { applyToJob } from '../../lib/api';

type Props = NativeStackScreenProps<CandidateStackParamList, 'CandidatureRapide'>;
type ApplicationDocument = DocumentPicker.DocumentPickerAsset;
type DocumentKind = 'cv' | 'motivation_letter';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function CandidatureRapideScreen({ navigation, route }: Props) {
  const title = route.params?.title ?? 'Offre sélectionnée';
  const company = route.params?.company ?? 'Entreprise';
  const jobId = route.params?.jobId;
  const { authState } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const displayInitial = authState.profile?.full_name?.trim()?.[0]?.toUpperCase() ?? '?';
  const [message, setMessage] = useState('');
  const [cvFile, setCvFile] = useState<ApplicationDocument | null>(null);
  const [motivationLetterFile, setMotivationLetterFile] = useState<ApplicationDocument | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectDocument = async (kind: DocumentKind) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ACCEPTED_FILE_TYPES,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const selectedFile = result.assets[0];
      if (selectedFile.size !== undefined && selectedFile.size > MAX_FILE_SIZE) {
        Alert.alert('Fichier trop volumineux', 'Chaque document doit faire 10 Mo maximum.');
        return;
      }

      if (kind === 'cv') setCvFile(selectedFile);
      else setMotivationLetterFile(selectedFile);
    } catch (error) {
      Alert.alert('Import impossible', (error as Error).message || 'Le document n’a pas pu être sélectionné.');
    }
  };

  const handleSubmit = async () => {
    if (!acceptedTerms || !candidateId || !jobId || !cvFile || !motivationLetterFile) return;
    setSubmitting(true);
    try {
      await applyToJob({
        candidate_id: candidateId,
        job_offer_id: jobId,
        motivation_message: message || undefined,
        cv_file: cvFile,
        motivation_letter_file: motivationLetterFile,
      });
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
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
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
              <Text className="font-sans text-body-md text-on-surface-variant">Joins ton CV et ta lettre de motivation en PDF ou DOCX (10 Mo maximum chacun). Le recruteur pourra les consulter avec ta candidature.</Text>
            </View>
          </View>
          <Pressable onPress={() => navigation.navigate('CreationProfilCandidat')} className="self-start py-2"><Text className="font-sans-semibold text-label-lg text-primary">Vérifier mon profil</Text></Pressable>
        </View>
        <View className="gap-md">
          <Text className="px-1 font-sans-semibold text-headline-md text-on-surface">Documents obligatoires</Text>
          {([
            { kind: 'cv' as const, title: 'CV', file: cvFile },
            { kind: 'motivation_letter' as const, title: 'Lettre de motivation', file: motivationLetterFile },
          ]).map(({ kind, title: documentTitle, file }) => (
            <View key={kind} className="flex-row items-center gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
              <MaterialIcons name={file ? 'description' : 'upload-file'} size={22} color={colors.primary} />
              <View className="flex-1">
                <Text className="font-sans-semibold text-label-lg text-on-surface">{documentTitle}</Text>
                <Text numberOfLines={1} className="font-sans text-label-md text-on-surface-variant">{file?.name ?? 'Aucun fichier sélectionné'}</Text>
              </View>
              <Pressable onPress={() => void selectDocument(kind)} className="rounded-full bg-primary-container/20 px-md py-2">
                <Text className="font-sans-semibold text-label-md text-primary">{file ? 'Remplacer' : 'Ajouter'}</Text>
              </Pressable>
            </View>
          ))}
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
          disabled={!acceptedTerms || submitting || !jobId || !candidateId || !cvFile || !motivationLetterFile}
          onPress={handleSubmit}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
            !acceptedTerms || submitting || !jobId || !candidateId || !cvFile || !motivationLetterFile ? 'opacity-50' : ''
          }`}
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">Envoyer ma candidature</Text>
          <MaterialIcons name="send" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}
