import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SelectField from '../../components/ui/SelectField';
import Button from '../../components/ui/Button';
import { colors } from '../../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { createDipeDeclaration, type DipeDeclarationItem } from '../../lib/api';

type Props = NativeStackScreenProps<RecruiterStackParamList, 'DeclarationEmbauche'>;
const CONTRACT_TYPES = [
  { label: 'CDI', value: 'cdi' }, { label: 'CDD', value: 'cdd' },
  { label: "Contrat d'apprentissage", value: 'apprentissage' }, { label: 'Journalier', value: 'journalier' },
];
const RISK_CATEGORIES = [
  { label: 'Bureau / Services (1,75%)', value: '1.75' },
  { label: 'Commerce / Distribution (2,5%)', value: '2.5' },
  { label: 'Industrie légère (3,5%)', value: '3.5' },
  { label: 'BTP / Industrie lourde (5%)', value: '5' },
];

export default function DeclarationEmbaucheScreen({ navigation, route }: Props) {
  const { authState } = useAuth();
  const candidateId = route.params?.candidateId;
  const companyId = authState.profile?.company_id;
  const candidateName = route.params?.candidateName ?? 'Candidat';
  const role = route.params?.role ?? 'Poste';
  const [hasExistingMatricule, setHasExistingMatricule] = useState(true);
  const [matricule, setMatricule] = useState('');
  const [cni, setCni] = useState('');
  const [contractType, setContractType] = useState('cdi');
  const [startDate, setStartDate] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [riskCategory, setRiskCategory] = useState('1.75');
  const [saving, setSaving] = useState(false);
  const [declaration, setDeclaration] = useState<DipeDeclarationItem | null>(null);

  const submit = async () => {
    if (!candidateId || !companyId) {
      Alert.alert('Informations manquantes', 'Ouvre cette démarche depuis le dossier d’un candidat accepté et vérifie le profil de ton entreprise.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || Number(grossSalary) <= 0 || (hasExistingMatricule ? !matricule.trim() : !cni.trim())) {
      Alert.alert('Vérifie le formulaire', 'Renseigne un matricule CNPS ou une CNI, une date AAAA-MM-JJ et un salaire valide.');
      return;
    }
    setSaving(true);
    try {
      const saved = await createDipeDeclaration({
        candidate_id: candidateId,
        company_id: companyId,
        contract_type: contractType,
        start_date: startDate,
        gross_salary: Number(grossSalary),
        risk_rate_percent: Number(riskCategory),
        existing_matricule: hasExistingMatricule ? matricule.trim() : undefined,
        candidate_cni: hasExistingMatricule ? undefined : cni.trim(),
      });
      setDeclaration(saved);
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible d’enregistrer la déclaration.');
    } finally { setSaving(false); }
  };

  if (declaration) return (
    <View className="flex-1 items-center justify-center gap-lg bg-background px-container-margin">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-secondary-container"><MaterialIcons name="fact-check" size={44} color={colors.onSecondaryContainer} /></View>
      <Text className="text-center font-sans-bold text-headline-lg text-on-surface">Déclaration enregistrée</Text>
      <Text className="text-center font-sans text-body-lg text-on-surface-variant">La déclaration de {candidateName} est enregistrée sous la référence {declaration.declaration_id}. Elle reste à transmettre à la CNPS ; aucune transmission automatique n’a été effectuée.</Text>
      <Text className="font-sans-semibold text-label-lg text-primary">Statut : {declaration.status}</Text>
      <Button label="Retour au dossier" onPress={() => navigation.goBack()} />
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Préparer une déclaration DIPE</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md"><View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Text className="font-sans-bold text-label-lg text-primary">{candidateName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text></View><View><Text className="font-sans-semibold text-title-lg text-on-surface">{candidateName}</Text><Text className="font-sans text-body-md text-on-surface-variant">{role}</Text></View></View>
        <View className="flex-row items-start gap-2 rounded-xl border border-tertiary/20 bg-tertiary-fixed/20 p-md"><MaterialIcons name="info-outline" size={18} color={colors.tertiary} /><Text className="flex-1 font-sans text-label-md text-on-surface-variant">Cette démarche enregistre les informations dans EmploiCamer. Elle ne transmet pas la déclaration à la CNPS : tu devras effectuer cette étape auprès de la CNPS.</Text></View>
        <View className="gap-md"><Text className="font-sans-semibold text-title-lg text-on-surface">Immatriculation du candidat</Text><View className="flex-row gap-2"><Pressable onPress={() => setHasExistingMatricule(true)} className={`flex-1 items-center rounded-xl border-2 py-3 ${hasExistingMatricule ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}><Text className="font-sans-semibold text-label-md text-on-surface">Déjà immatriculé</Text></Pressable><Pressable onPress={() => setHasExistingMatricule(false)} className={`flex-1 items-center rounded-xl border-2 py-3 ${!hasExistingMatricule ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}><Text className="font-sans-semibold text-label-md text-on-surface">Première immatriculation</Text></Pressable></View><TextInput value={hasExistingMatricule ? matricule : cni} onChangeText={hasExistingMatricule ? setMatricule : setCni} placeholder={hasExistingMatricule ? 'Matricule CNPS' : 'Numéro CNI'} keyboardType="default" className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface" /></View>
        <View className="gap-md"><Text className="font-sans-semibold text-title-lg text-on-surface">Détails du contrat</Text><SelectField placeholder="Type de contrat" options={CONTRACT_TYPES} value={contractType} onChange={setContractType} /><TextInput value={startDate} onChangeText={setStartDate} placeholder="Date de début (AAAA-MM-JJ)" className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface" /><TextInput value={grossSalary} onChangeText={setGrossSalary} placeholder="Salaire brut mensuel (FCFA)" keyboardType="numeric" className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface" /><SelectField placeholder="Catégorie de risque" options={RISK_CATEGORIES} value={riskCategory} onChange={setRiskCategory} /></View>
        <Pressable disabled={saving} onPress={() => void submit()} className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary">{saving ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="save" size={18} color="#fff" /><Text className="font-sans-semibold text-label-lg text-on-primary">Enregistrer la déclaration</Text></>}</Pressable>
      </ScrollView>
    </View>
  );
}
