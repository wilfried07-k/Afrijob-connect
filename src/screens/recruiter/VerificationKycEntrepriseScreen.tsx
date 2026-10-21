import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { upsertCompany } from '../../lib/api';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'VerificationKycEntreprise'>;

const STEPS = [
  { key: 'document', label: 'Document' },
  { key: 'selfie', label: 'Selfie' },
  { key: 'review', label: 'Finaliser' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

function Stepper({ current }: { current: StepKey }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  return (
    <View className="flex-row items-center px-container-margin py-md">
      {STEPS.map((step, i) => (
        <View key={step.key} className="flex-1 flex-row items-center">
          <View className="items-center">
            <View
              className={`h-8 w-8 items-center justify-center rounded-full ${
                i < currentIndex ? 'bg-secondary-container' : i === currentIndex ? 'bg-primary' : 'bg-surface-variant'
              }`}
            >
              {i < currentIndex ? (
                <MaterialIcons name="check" size={16} color={colors.onSecondaryContainer} />
              ) : (
                <Text className={`font-sans-bold text-xs ${i === currentIndex ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text className={`mt-1 text-[10px] font-sans-medium ${i === currentIndex ? 'text-primary' : 'text-on-surface-variant'}`}>
              {step.label}
            </Text>
          </View>
          {i < STEPS.length - 1 && (
            <View className={`mb-4 h-[2px] flex-1 ${i < currentIndex ? 'bg-primary' : 'bg-surface-variant'}`} />
          )}
        </View>
      ))}
    </View>
  );
}

export default function VerificationKycEntrepriseScreen({ navigation }: Props) {
  const { authState, refreshProfile } = useAuth();
  const profile = authState.profile;

  const [step, setStep] = useState<StepKey>('document');
  const [documentCaptured, setDocumentCaptured] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const companyName = profile?.company_name || 'Entreprise Partenaire';
  const directorName = profile?.full_name || 'Directeur Général';
  const email = profile?.email || 'contact@entreprise.cm';

  const legalInfo = [
    { label: 'Raison Sociale', value: companyName },
    { label: 'Numéro RCCM', value: 'RC/DLA/2026/B/5678' },
    { label: 'Numéro NIU', value: 'M019283746501Z' },
    { label: 'Siège Social', value: profile?.city ? `${profile.city}, Cameroun` : 'Douala, Cameroun' },
  ];

  const directorInfo = [
    { label: 'Nom Complet', value: directorName },
    { label: 'Nationalité', value: 'Camerounaise' },
    { label: "Pièce d'identité", value: 'CNI Numérique' },
    { label: 'Email Pro', value: email },
  ];

  const handleSubmitReview = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (authState.userId) {
        await upsertCompany({
          owner_user_id: authState.userId,
          name: companyName,
          sector: 'Entreprise de services',
          description: profile?.summary,
        });
        await refreshProfile();
      }
      Alert.alert(
        'Dossier KYC transmis',
        'Votre dossier a été soumis avec succès à l’équipe de conformité EmploiCamer. Le badge Entreprise Vérifiée sera activé sous 24-48h.',
        [{ text: 'Compris', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Échec de la soumission du dossier.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name={step === 'document' ? 'arrow-back' : 'close'} size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-title-lg text-primary">Vérification KYC</Text>
        <View className="w-6" />
      </View>

      <Stepper current={step} />

      {step === 'document' && (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View>
            <Text className="font-sans-bold text-headline-lg text-on-surface">Preuve d'identité</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">Étape 1/3</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-xl border border-primary-container/20 bg-primary-container/10 p-md">
            <MaterialIcons name="verified-user" size={20} color={colors.primary} />
            <Text className="flex-1 font-sans-semibold text-label-lg text-primary">
              Vos documents sont chiffrés et vérifiés par l'administration.
            </Text>
          </View>
          <View className="gap-2">
            <Instruction number={1} text="Placez votre CNI ou Passeport dans le cadre ci-dessous." />
            <Instruction number={2} text="Assurez-vous que le texte est lisible et qu'il n'y a pas de reflets." />
          </View>

          <View className="aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-surface-container-highest">
            {documentCaptured ? (
              <View className="items-center gap-2">
                <MaterialIcons name="check-circle" size={48} color={colors.secondary} />
                <Text className="font-sans-semibold text-title-md text-on-surface">Document enregistré</Text>
              </View>
            ) : (
              <Pressable
                onPress={() => setDocumentCaptured(true)}
                className="items-center gap-2"
              >
                <MaterialIcons name="camera-alt" size={48} color={colors.primary} />
                <Text className="font-sans-semibold text-label-lg text-primary">Prendre une photo</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            disabled={!documentCaptured}
            onPress={() => setStep('selfie')}
            className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
              !documentCaptured ? 'opacity-40' : ''
            }`}
          >
            <Text className="font-sans-semibold text-title-lg text-on-primary">Continuer</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
          </Pressable>
        </ScrollView>
      )}

      {step === 'selfie' && (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View>
            <Text className="font-sans-bold text-headline-lg text-on-surface">Selfie de vérification</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">Étape 2/3</Text>
          </View>
          <View className="gap-2">
            <Instruction number={1} text="Positionnez votre visage au centre du cadre." />
            <Instruction number={2} text="Retirez vos lunettes et assurez-vous d'avoir un bon éclairage." />
          </View>

          <View className="aspect-square items-center justify-center overflow-hidden rounded-full bg-surface-container-highest mx-auto w-64">
            {selfieCaptured ? (
              <View className="items-center gap-2">
                <MaterialIcons name="check-circle" size={48} color={colors.secondary} />
                <Text className="font-sans-semibold text-title-md text-on-surface">Photo validée</Text>
              </View>
            ) : (
              <Pressable
                onPress={() => setSelfieCaptured(true)}
                className="items-center gap-2"
              >
                <MaterialIcons name="face" size={56} color={colors.primary} />
                <Text className="font-sans-semibold text-label-lg text-primary">Prendre le selfie</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            disabled={!selfieCaptured}
            onPress={() => setStep('review')}
            className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
              !selfieCaptured ? 'opacity-40' : ''
            }`}
          >
            <Text className="font-sans-semibold text-title-lg text-on-primary">Passer à la révision</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
          </Pressable>
        </ScrollView>
      )}

      {step === 'review' && (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <View>
            <Text className="font-sans-bold text-headline-lg text-on-surface">Vérification finale</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">Étape 3/3</Text>
          </View>

          <InfoCard icon="business" title="Informations Entreprise" rows={legalInfo} />
          <InfoCard icon="person" title="Représentant Légal" rows={directorInfo} />

          <View className="flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <MaterialIcons name="lock" size={18} color={colors.onSurfaceVariant} />
            <Text className="flex-1 font-sans text-body-md text-on-surface-variant">
              En soumettant, vous certifiez l'exactitude de ces informations conformément à la réglementation OHADA et camerounaise.
            </Text>
          </View>

          <Pressable
            disabled={submitting}
            onPress={() => void handleSubmitReview()}
            className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="send" size={18} color="#ffffff" />
                <Text className="font-sans-semibold text-title-lg text-on-primary">Soumettre pour vérification</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      )}
    </Screen>
  );
}

function Instruction({ number, text }: { number: number; text: string }) {
  return (
    <View className="flex-row items-start gap-md">
      <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
        <Text className="font-sans-bold text-[12px] text-on-primary">{number}</Text>
      </View>
      <Text className="flex-1 font-sans text-body-md text-on-surface-variant">{text}</Text>
    </View>
  );
}

function InfoCard({
  icon,
  title,
  rows,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name={icon} size={20} color={colors.primary} />
        <Text className="font-sans-semibold text-title-lg text-on-surface">{title}</Text>
      </View>
      <View className="gap-2">
        {rows.map((row) => (
          <View key={row.label} className="flex-row justify-between border-b border-outline-variant/20 pb-1">
            <Text className="font-sans text-body-md text-on-surface-variant">{row.label}</Text>
            <Text className="font-sans-semibold text-label-lg text-on-surface">{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
