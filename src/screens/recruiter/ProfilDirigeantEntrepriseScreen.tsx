import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../lib/auth';
import { getCompanyDirector, saveCompanyDirector } from '../../lib/api';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

export default function ProfilDirigeantEntrepriseScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState(authState.profile?.email ?? '');
  const [phone, setPhone] = useState(authState.profile?.phone ?? '');
  const [identityStatus, setIdentityStatus] = useState('Non vérifiée');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    getCompanyDirector()
      .then((profile) => {
        if (!active || !profile) return;
        setFullName(profile.full_name);
        setTitle(profile.title);
        setEmail(profile.professional_email ?? authState.profile?.email ?? '');
        setPhone(profile.phone ?? authState.profile?.phone ?? '');
        setIdentityStatus(profile.identity_status);
      })
      .catch((err) => { if (active) setLoadError((err as Error).message || 'Impossible de charger le profil dirigeant.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [authState.profile?.email, authState.profile?.phone]);

  const save = async () => {
    if (!fullName.trim() || !title.trim()) { Alert.alert('Informations requises', 'Renseigne le nom complet et la fonction.'); return; }
    setSaving(true);
    try {
      const profile = await saveCompanyDirector({
        full_name: fullName.trim(),
        title: title.trim(),
        professional_email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setIdentityStatus(profile.identity_status);
      Alert.alert('Profil enregistré', 'Les coordonnées du dirigeant sont enregistrées dans le compte de l’entreprise.');
    } catch (err) { Alert.alert('Erreur', (err as Error).message || 'Impossible d’enregistrer le profil dirigeant.'); }
    finally { setSaving(false); }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Profil du dirigeant</Text>
      </View>
      {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.primary} /></View> : <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        {loadError ? <Text className="font-sans text-body-md text-error">{loadError}</Text> : null}
        <View className="items-center gap-2">
          <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-primary-fixed bg-primary/10"><MaterialIcons name="badge" size={36} color={colors.primary} /></View>
          <Text className="font-sans text-body-md text-on-surface-variant">Coordonnées privées du compte propriétaire de l’entreprise</Text>
        </View>
        <Field label="Nom complet *" value={fullName} onChangeText={setFullName} placeholder="Nom du dirigeant" />
        <Field label="Fonction *" value={title} onChangeText={setTitle} placeholder="Ex. Directeur général" />
        <Field label="Email professionnel" value={email} onChangeText={setEmail} placeholder="nom@entreprise.cm" keyboardType="email-address" />
        <Field label="Téléphone professionnel" value={phone} onChangeText={setPhone} placeholder="+237 ..." keyboardType="phone-pad" />
        <View className="flex-row items-start gap-2 rounded-xl border border-tertiary/30 bg-tertiary/10 p-md">
          <MaterialIcons name="info-outline" size={20} color={colors.tertiary} />
          <Text className="flex-1 font-sans text-label-lg text-on-surface-variant">Statut d’identité : {identityStatus}. La vérification CNI n’est pas disponible ici ; aucun numéro de pièce n’est enregistré comme vérifié.</Text>
        </View>
        <Pressable disabled={saving} onPress={() => void save()} className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary">
          {saving ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="save" size={18} color="#fff" /><Text className="font-sans-semibold text-title-lg text-white">Enregistrer</Text></>}
        </Pressable>
      </ScrollView>}
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: 'email-address' | 'phone-pad' }) {
  return <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.outline} keyboardType={keyboardType} autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'} className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface" /></View>;
}