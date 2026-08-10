import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'VerificationKycEntreprise'>;

const STEPS = [
  { key: 'document', label: 'Document' },
  { key: 'selfie', label: 'Selfie' },
  { key: 'review', label: 'Finaliser' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

const LEGAL_INFO = [
  { label: 'Raison Sociale', value: 'TechCamer Solutions SARL' },
  { label: 'Numéro RCCM', value: 'RC/DLA/2023/B/1234' },
  { label: 'Numéro NIU', value: 'M012345678901Z' },
  { label: 'Siège Social', value: 'Douala, Akwa' },
];

const DIRECTOR_INFO = [
  { label: 'Nom Complet', value: 'Jean Dupont' },
  { label: 'Nationalité', value: 'Camerounaise' },
  { label: "Pièce d'identité", value: 'CNI n° 102938475' },
  { label: 'Email Pro', value: 'j.dupont@techcamer.cm' },
];

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
  const [step, setStep] = useState<StepKey>('document');
  const [documentCaptured, setDocumentCaptured] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);

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
              Vos données sont cryptées et sécurisées.
            </Text>
          </View>
          <View className="gap-2">
            <Instruction number={1} text="Placez votre CNI ou Passeport dans le cadre ci-dessous." />
            <Instruction number={2} text="Assurez-vous que le texte est lisible et qu'il n'y a pas de reflets." />
          </View>

          <View className="aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-surface-container-highest">
            <View className="relative h-4/5 w-4/5">
              <View className="absolute -top-1 -left-1 h-6 w-6 border-l-4 border-t-4 border-primary" />
              <View className="absolute -top-1 -right-1 h-6 w-6 border-r-4 border-t-4 border-primary" />
              <View className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary" />
              <View className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary" />
              <View className="flex-1 items-center justify-center">
                <MaterialIcons name="crop-free" size={40} color={colors.primary} />
              </View>
            </View>
          </View>

          <View className="gap-md">
            <Pressable
              onPress={() => setDocumentCaptured(true)}
              className="h-14 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg"
            >
              <MaterialIcons name="photo-camera" size={20} color="#ffffff" />
              <Text className="font-sans-semibold text-title-lg text-on-primary">Prendre la photo</Text>
            </Pressable>
            <Pressable
              onPress={() => setDocumentCaptured(true)}
              className="h-14 flex-row items-center justify-center gap-2 rounded-xl border border-outline"
            >
              <MaterialIcons name="upload-file" size={20} color={colors.primary} />
              <Text className="font-sans-semibold text-label-lg text-primary">
                Importer un fichier (PDF/JPG)
              </Text>
            </Pressable>
          </View>

          {documentCaptured && (
            <View className="flex-row items-center gap-2 rounded-xl bg-secondary-container/20 p-md">
              <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
              <Text className="font-sans-semibold text-label-lg text-secondary">Document capturé avec succès</Text>
            </View>
          )}

          <Pressable
            disabled={!documentCaptured}
            onPress={() => setStep('selfie')}
            className={`h-12 items-center justify-center rounded-full bg-primary ${!documentCaptured ? 'opacity-40' : ''}`}
          >
            <Text className="font-sans-semibold text-label-lg text-on-primary">Continuer</Text>
          </Pressable>
        </ScrollView>
      )}

      {step === 'selfie' && (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View>
            <Text className="font-sans-bold text-headline-lg-mobile text-on-surface">
              Vérification de l'identité
            </Text>
            <Text className="font-sans text-body-md text-on-surface-variant">
              Tenez votre pièce d'identité à côté de votre visage et assurez-vous qu'elle soit lisible.
            </Text>
          </View>

          <View className="aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl border-4 border-surface-container-high bg-on-background">
            <View className="h-[280px] w-[280px] items-center justify-center rounded-full border-2 border-dashed border-white/60">
              <MaterialIcons name="face" size={48} color="rgba(255,255,255,0.4)" />
            </View>
          </View>

          <Pressable
            onPress={() => setSelfieCaptured(true)}
            className="h-14 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg"
          >
            <MaterialIcons name="photo-camera" size={20} color="#ffffff" />
            <Text className="font-sans-semibold text-title-lg text-on-primary">Prendre le selfie</Text>
          </Pressable>

          {selfieCaptured && (
            <View className="flex-row items-center gap-2 rounded-xl bg-secondary-container/20 p-md">
              <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
              <Text className="font-sans-semibold text-label-lg text-secondary">Selfie capturé avec succès</Text>
            </View>
          )}

          <Pressable
            disabled={!selfieCaptured}
            onPress={() => setStep('review')}
            className={`h-12 items-center justify-center rounded-full bg-primary ${!selfieCaptured ? 'opacity-40' : ''}`}
          >
            <Text className="font-sans-semibold text-label-lg text-on-primary">Continuer</Text>
          </Pressable>
        </ScrollView>
      )}

      {step === 'review' && (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="font-sans-bold text-headline-lg text-on-surface">Vérification Finale</Text>
              <Text className="font-sans text-body-md text-on-surface-variant">
                Veuillez réviser vos informations avant soumission.
              </Text>
            </View>
            <View className="rounded-full bg-primary-fixed px-md py-1">
              <Text className="font-sans-semibold text-label-lg text-primary">100%</Text>
            </View>
          </View>
          <View className="h-3 w-full overflow-hidden rounded-full bg-surface-container">
            <View className="h-full w-full rounded-full bg-primary" />
          </View>

          <InfoCard icon="business" title="Informations Légales" rows={LEGAL_INFO} />
          <InfoCard icon="person" title="Directeur Général" rows={DIRECTOR_INFO} />

          <View className="flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <MaterialIcons name="lock" size={18} color={colors.onSurfaceVariant} />
            <Text className="flex-1 font-sans text-body-md text-on-surface-variant">
              En soumettant, vous certifiez l'exactitude de ces informations conformément à la
              réglementation en vigueur au Cameroun.
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.goBack()}
            className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg"
          >
            <MaterialIcons name="send" size={18} color="#ffffff" />
            <Text className="font-sans-semibold text-title-lg text-on-primary">Soumettre pour vérification</Text>
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
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name={icon} size={20} color={colors.primary} />
          <Text className="font-sans-semibold text-title-lg text-on-surface">{title}</Text>
        </View>
        <Text className="font-sans-semibold text-label-lg text-primary">Modifier</Text>
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
