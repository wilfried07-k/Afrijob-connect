import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SelectField from '../../components/ui/SelectField';
import Button from '../../components/ui/Button';
import { colors } from '../../theme';

/**
 * Destination : src/screens/recruiter/DeclarationEmbaucheScreen.tsx
 *
 * Déclaration d'Immatriculation du Personnel Employé (DIPE) — l'employeur a
 * l'obligation légale de déclarer chaque nouvel employé à la CNPS. Cet écran
 * remplace la démarche manuelle (télédéclaration DIPE sur cnps.cm ou passage
 * en agence) par un formulaire intégré au flux de recrutement de l'app :
 * dès qu'un recruteur confirme une embauche, il peut déclarer directement.
 *
 * À brancher : après confirmation d'embauche dans le pipeline candidats,
 * ou depuis DetailsCandidatScreen (bouton "Déclarer l'embauche").
 */

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
  route?: { params?: { candidateName?: string; role?: string } };
};

const CONTRACT_TYPES = [
  { label: 'CDI', value: 'cdi' },
  { label: 'CDD', value: 'cdd' },
  { label: "Contrat d'apprentissage", value: 'apprentissage' },
  { label: 'Journalier', value: 'journalier' },
];

const RISK_CATEGORIES = [
  { label: 'Bureau / Services (1,75%)', value: '1.75' },
  { label: 'Commerce / Distribution (2,5%)', value: '2.5' },
  { label: 'Industrie légère (3,5%)', value: '3.5' },
  { label: 'BTP / Industrie lourde (5%)', value: '5' },
];

export default function DeclarationEmbaucheScreen({ navigation, route }: Props) {
  const candidateName = route?.params?.candidateName ?? 'Jean-Paul Nkou';
  const role = route?.params?.role ?? 'Développeur Fullstack';

  const [hasExistingMatricule, setHasExistingMatricule] = useState(true);
  const [matricule, setMatricule] = useState('');
  const [cni, setCni] = useState('');
  const [contractType, setContractType] = useState('cdi');
  const [startDate, setStartDate] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [riskCategory, setRiskCategory] = useState('1.75');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = (hasExistingMatricule ? matricule.length > 0 : cni.length > 0) && startDate.length > 0 && grossSalary.length > 0;

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-secondary-container shadow-lg">
          <MaterialIcons name="fact-check" size={44} color={colors.onSecondaryContainer} />
        </View>
        <Text className="text-center font-sans-bold text-headline-lg text-on-surface">
          Déclaration DIPE transmise
        </Text>
        <Text className="max-w-xs text-center font-sans text-body-lg text-on-surface-variant">
          L'embauche de <Text className="font-sans-bold text-on-surface">{candidateName}</Text> a été
          déclarée à la CNPS. Un accusé de réception sera envoyé sous 48-72h avec le matricule assuré
          social définitif.
        </Text>
        <View className="w-full flex-row items-start gap-2 rounded-xl border border-tertiary/20 bg-tertiary-fixed/20 p-md">
          <MaterialIcons name="schedule" size={18} color={colors.tertiary} />
          <Text className="flex-1 font-sans text-label-md text-on-surface-variant">
            Rappel légal : cette déclaration doit être faite dans les 8 jours suivant la prise de
            fonction du salarié.
          </Text>
        </View>
        <Button label="Retour à l'équipe" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Déclaration CNPS (DIPE)</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Text className="font-sans-bold text-label-lg text-primary">
              {candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
          <View>
            <Text className="font-sans-semibold text-title-lg text-on-surface">{candidateName}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">{role}</Text>
          </View>
        </View>

        <View className="flex-row items-start gap-2 rounded-xl border border-primary/20 bg-primary-container/5 p-md">
          <MaterialIcons name="gavel" size={18} color={colors.primary} />
          <Text className="flex-1 font-sans text-label-md text-on-surface-variant">
            Tout employeur doit immatriculer chaque salarié à la CNPS. Le travailleur reçoit un numéro
            d'assuré social qui le suit toute sa carrière.
          </Text>
        </View>

        {/* Statut CNPS du candidat */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Statut CNPS du candidat</Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setHasExistingMatricule(true)}
              className={`flex-1 items-center rounded-xl border-2 py-3 ${hasExistingMatricule ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}
            >
              <Text className={`font-sans-semibold text-label-md ${hasExistingMatricule ? 'text-primary' : 'text-on-surface'}`}>
                Déjà immatriculé
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setHasExistingMatricule(false)}
              className={`flex-1 items-center rounded-xl border-2 py-3 ${!hasExistingMatricule ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}
            >
              <Text className={`font-sans-semibold text-label-md ${!hasExistingMatricule ? 'text-primary' : 'text-on-surface'}`}>
                1ère immatriculation
              </Text>
            </Pressable>
          </View>

          {hasExistingMatricule ? (
            <View className="gap-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
                Numéro d'assuré social CNPS
              </Text>
              <TextInput
                value={matricule}
                onChangeText={setMatricule}
                placeholder="ex : 1 09 88 04123 45"
                placeholderTextColor={colors.outline}
                keyboardType="numeric"
                className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
              />
            </View>
          ) : (
            <View className="gap-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
                Numéro CNI du candidat
              </Text>
              <TextInput
                value={cni}
                onChangeText={setCni}
                placeholder="ex : 102938475"
                placeholderTextColor={colors.outline}
                className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
              />
              <Text className="font-sans text-label-md text-on-surface-variant">
                Un nouveau matricule assuré social sera généré par la CNPS sous 48-72h.
              </Text>
            </View>
          )}
        </View>

        {/* Détails du contrat */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Détails du contrat</Text>
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Type de contrat</Text>
            <SelectField placeholder="Type de contrat" options={CONTRACT_TYPES} value={contractType} onChange={setContractType} />
          </View>
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Date de prise de fonction</Text>
            <TextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={colors.outline}
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
              Salaire brut mensuel (FCFA)
            </Text>
            <TextInput
              value={grossSalary}
              onChangeText={setGrossSalary}
              placeholder="ex : 450000"
              placeholderTextColor={colors.outline}
              keyboardType="numeric"
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
            <Text className="font-sans text-label-md text-on-surface-variant">
              Plafond de cotisation CNPS : 300 000 FCFA/mois.
            </Text>
          </View>
          <View className="gap-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
              Catégorie de risque professionnel
            </Text>
            <SelectField placeholder="Catégorie de risque" options={RISK_CATEGORIES} value={riskCategory} onChange={setRiskCategory} />
          </View>
        </View>

        <Button label="Transmettre la déclaration" onPress={() => setSubmitted(true)} disabled={!canSubmit} />
      </ScrollView>
    </View>
  );
}
