import { useEffect, useState } from 'react';
import { Alert, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SelectField from '../../components/ui/SelectField';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { getCompany, upsertCompany } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };

const SECTORS = [
  { label: 'Télécommunications', value: 'telecom' },
  { label: 'Banque & Finance', value: 'finance' },
  { label: 'BTP & Construction', value: 'btp' },
  { label: 'Technologie', value: 'tech' },
];

export default function CreationProfilEntrepriseScreen({ navigation }: Props) {
  const { authState, refreshProfile } = useAuth();
  const [name, setName] = useState(authState.profile?.company_name ?? '');
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const companyId = authState.profile?.company_id;

  useEffect(() => {
    let active = true;
    if (!companyId) return () => { active = false; };
    getCompany(companyId)
      .then((company) => {
        if (!active) return;
        setName(company.name);
        setSector(company.sector ?? '');
        setDescription(company.description ?? '');
      })
      .catch((error) => {
        if (active) Alert.alert('Erreur', (error as Error).message || 'Impossible de charger le profil entreprise.');
      });
    return () => { active = false; };
  }, [companyId]);

  const saveCompany = async () => {
    if (!authState.userId) {
      Alert.alert('Connexion requise', 'Connectez-vous pour créer le profil de l’entreprise.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Nom requis', 'Saisissez le nom de votre entreprise.');
      return;
    }
    setSaving(true);
    try {
      await upsertCompany({
        owner_user_id: authState.userId,
        name: name.trim(),
        sector: sector || undefined,
        description: description.trim() || undefined,
      });
      await refreshProfile();
      Alert.alert('Profil entreprise enregistré', 'Les informations de l’entreprise ont été sauvegardées.', [
        { text: 'Continuer', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Impossible d’enregistrer l’entreprise.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Profil de l'entreprise</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Nom de l'entreprise</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex : TechCamer Solutions"
            placeholderTextColor={colors.outline}
            className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
          />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Secteur d'activité</Text>
          <SelectField placeholder="Choisir un secteur" options={SECTORS} value={sector} onChange={setSector} />
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Présentez votre entreprise, sa mission, ses valeurs..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-[120px] rounded-lg border border-outline p-md font-sans text-body-md text-on-surface"
          />
        </View>

        <Pressable
          onPress={saveCompany}
          disabled={saving}
          className="h-14 items-center justify-center rounded-full bg-primary shadow-lg"
        >
          <Text className="font-sans-semibold text-title-lg text-on-primary">
            {saving ? 'Enregistrement...' : 'Enregistrer le profil'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
