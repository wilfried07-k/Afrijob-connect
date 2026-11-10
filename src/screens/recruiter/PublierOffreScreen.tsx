import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../lib/auth';
import { createJob, type CreateJobPayload } from '../../lib/api';
import { RecruiterStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'PublierOffre'>;

const CATEGORIES = [
  { label: 'Technologie & IT', value: 'tech' },
  { label: 'Finance & Comptabilité', value: 'finance' },
  { label: 'Marketing & Communication', value: 'marketing' },
  { label: 'Ressources Humaines', value: 'hr' },
  { label : 'Ventes & Développement Commercial', value: 'sales' },
  { label: 'Santé & Médecine', value: 'health' },
];

const LOCATIONS = [
  { label: 'Douala, Littoral', value: 'douala' },
  { label: 'Yaoundé, Centre', value: 'yaounde' },
  { label: 'Bafoussam, Ouest', value: 'bafoussam' },
  { label: 'Télétravail (100%)', value: 'remote' },
  { label: 'Autre', value: 'other' },
];

const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Stage'];

const STEP_LABELS = ['Informations de base', 'Contrat & salaire', 'Description & profil'];

export default function PublierOffreScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [contract, setContract] = useState('CDI');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [profile, setProfile] = useState('');

  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [submitting, setSubmitting] = useState(false);
  const isLastStep = step === STEP_LABELS.length - 1;

  const handlePublish = async () => {
    if (!companyId) {
      Alert.alert('Erreur', "Impossible de publier l'offre sans entreprise associée.");
      return;
    }

    const payload: CreateJobPayload = {
      company_id: companyId,
      title,
      description,
      requirements: profile || description,
      city: location || undefined,
      contract_type: contract || undefined,
      salary_min: salaryMin ? Number(salaryMin) : undefined,
      salary_max: salaryMax ? Number(salaryMax) : undefined,
    };

    try {
      setSubmitting(true);
      await createJob(payload);
      navigation.navigate('RecruiterTabs');
    } catch (error) {
      console.error('Erreur publication offre', error);
      Alert.alert('Erreur', String(error));
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
        <Text className="font-sans-bold text-title-lg text-primary">Nouvelle offre</Text>
        <View className="w-6" />
      </View>

      {/* Progress stepper */}
      <View className="flex-row items-center gap-2 border-b border-outline-variant bg-surface-container-low px-container-margin py-md">
        {STEP_LABELS.map((_, i) => (
          <View
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-outline-variant'}`}
          />
        ))}
      </View>
      <Text className="px-container-margin pt-2 font-sans-medium text-label-md text-on-surface-variant">
        Étape {step + 1} sur {STEP_LABELS.length} : {STEP_LABELS[step]}
      </Text>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            <Field label="Titre du poste" required>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="ex: Senior Fullstack Developer"
                placeholderTextColor={colors.outline}
                className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
              />
            </Field>
            <Field label="Catégorie" required>
              <SelectField placeholder="Sélectionner une catégorie" options={CATEGORIES} value={category} onChange={setCategory} />
            </Field>
            <Field label="Localisation" required>
              <SelectField icon="location-on" placeholder="Sélectionner une ville" options={LOCATIONS} value={location} onChange={setLocation} />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Type de contrat">
              <View className="flex-row flex-wrap gap-2">
                {CONTRACT_TYPES.map((type) => {
                  const active = type === contract;
                  return (
                    <Pressable
                      key={type}
                      onPress={() => setContract(type)}
                      className={`rounded-full border px-md py-2 ${
                        active ? 'border-primary bg-primary-container' : 'border-outline'
                      }`}
                    >
                      <Text className={`font-sans-medium text-label-md ${active ? 'text-on-primary-container' : 'text-on-surface'}`}>
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Field>
            <Field label="Fourchette salariale (Mensuel XAF)">
              <View className="flex-row items-center gap-2">
                <TextInput
                  value={salaryMin}
                  onChangeText={setSalaryMin}
                  placeholder="Min"
                  keyboardType="numeric"
                  placeholderTextColor={colors.outline}
                  className="h-12 flex-1 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
                />
                <Text className="text-outline">à</Text>
                <TextInput
                  value={salaryMax}
                  onChangeText={setSalaryMax}
                  placeholder="Max"
                  keyboardType="numeric"
                  placeholderTextColor={colors.outline}
                  className="h-12 flex-1 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
                />
              </View>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Description du poste & Missions" required hint="Minimum 200 caractères">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez les responsabilités quotidiennes, l'environnement de travail et l'impact du poste..."
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                className="min-h-[160px] rounded-lg border border-outline p-md font-sans text-body-md text-on-surface"
              />
            </Field>
            <Field label="Profil recherché & Compétences">
              <TextInput
                value={profile}
                onChangeText={setProfile}
                placeholder="Diplômes requis, années d'expérience, outils maîtrisés, soft skills..."
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="min-h-[120px] rounded-lg border border-outline p-md font-sans text-body-md text-on-surface"
              />
            </Field>
          </>
        )}
      </ScrollView>

      {/* Footer actions */}
      <View className="flex-row items-center justify-between gap-md border-t border-outline-variant bg-surface-container px-container-margin py-md">
        {step > 0 ? (
          <Pressable
            onPress={() => setStep((s) => s - 1)}
            className="h-12 flex-1 items-center justify-center rounded-full border border-primary"
          >
            <Text className="font-sans-semibold text-label-lg text-primary">Précédent</Text>
          </Pressable>
        ) : (
          <Pressable className="h-12 flex-1 items-center justify-center rounded-full border border-primary">
            <Text className="font-sans-semibold text-label-lg text-primary">Enregistrer brouillon</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => (isLastStep ? handlePublish() : setStep((s) => s + 1))}
          className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-md"
        >
          <Text className="font-sans-semibold text-label-lg text-on-primary">
            {isLastStep ? "Publier l'offre" : 'Suivant'}
          </Text>
          <MaterialIcons name={isLastStep ? 'check' : 'arrow-forward'} size={18} color="#ffffff" />
        </Pressable>
      </View>
    </Screen>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-semibold text-label-lg text-on-surface">
          {label} {required && <Text className="text-error">*</Text>}
        </Text>
        {hint && <Text className="font-sans text-label-md text-on-surface-variant">{hint}</Text>}
      </View>
      {children}
    </View>
  );
}
