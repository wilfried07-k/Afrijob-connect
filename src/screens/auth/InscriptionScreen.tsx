import { useState } from 'react';
import { View, Text, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import { colors } from '../../theme';
import { register, AccountType } from '../../lib/api';
import { useAuth } from '../../lib/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Inscription'>;

// Vrais logos des fournisseurs (PNG hotlink via icons8, gratuit pour usage faible volume).
// Pour la production, télécharge ces images et mets-les dans /assets pour un require() local,
// plus fiable qu'un lien externe.
const SOCIAL_PROVIDERS = [
  { key: 'google', label: 'Google', logo: 'https://img.icons8.com/color/96/google-logo.png' },
  { key: 'facebook', label: 'Facebook', logo: 'https://img.icons8.com/color/96/facebook-new.png' },
] as const;

export default function InscriptionScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('candidate');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn } = useAuth();

  const canSubmit = fullName && email && phone && password && acceptedTerms;

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        {/* Header fixe : toujours visible, ne défile pas */}
        <View className="h-14 flex-row items-center justify-between px-container-margin">
          <Pressable onPress={() => navigation.navigate('Connexion')} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="font-sans-semibold text-title-lg text-on-surface">Créer un compte</Text>
          <View className="w-6" />
        </View>

        {/* Contenu scrollable */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-lg items-center gap-xs">
            <Text className="font-sans-extrabold text-headline-lg-mobile text-primary tracking-tight">
              EmploiCamer
            </Text>
            <Text className="text-center font-sans text-body-md text-on-surface-variant">
              Créez votre compte pour booster votre carrière au Cameroun.
            </Text>
          </View>

          <View className="gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-lg">
            <View className="flex-row gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-1.5">
              {(['candidate', 'recruiter'] as AccountType[]).map((type) => {
                const active = type === accountType;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setAccountType(type)}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                      active ? 'bg-primary-container' : ''
                    }`}
                  >
                    <MaterialIcons
                      name={type === 'candidate' ? 'work' : 'business'}
                      size={18}
                      color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant}
                    />
                    <Text
                      className={`font-sans-semibold text-label-lg ${
                        active ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      {type === 'candidate' ? 'Candidat' : 'Recruteur'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <TextField
              label="Nom complet"
              icon="person"
              placeholder="Ex: Jean Kouam"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextField
              label="Email"
              icon="mail"
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              label="Numéro de téléphone"
              icon="call"
              placeholder="+237 6xx xxx xxx"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextField
              label="Mot de passe"
              icon="lock"
              isPassword
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
            />
<TextField
              label="Code de parrainage (facultatif)"
              icon="card-giftcard"
              placeholder="Ex. EC12AB34CD"
              autoCapitalize="characters"
              value={referralCode}
              onChangeText={setReferralCode}
            />

            {/* Terms */}
            <Pressable
              className="flex-row items-start gap-3 py-1"
              onPress={() => setAcceptedTerms((v) => !v)}
            >
              <View
                className={`mt-0.5 h-6 w-6 items-center justify-center rounded border ${
                  acceptedTerms ? 'border-primary bg-primary' : 'border-outline-variant'
                }`}
              >
                {acceptedTerms && <MaterialIcons name="check" size={16} color="#ffffff" />}
              </View>
              <Text className="flex-1 font-sans text-body-md leading-tight text-on-surface-variant">
                J'accepte les{' '}
                <Text className="font-sans-bold text-primary">Conditions d'utilisation</Text> et la{' '}
                <Text className="font-sans-bold text-primary">Politique de confidentialité</Text>.
              </Text>
            </Pressable>

            {errorMessage ? (
              <View className="flex-row items-center gap-2 rounded-lg border border-error/30 bg-error-container/20 p-md">
                <MaterialIcons name="error-outline" size={20} color={colors.error} />
                <Text className="flex-1 font-sans text-body-md text-error">{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View className="gap-2 rounded-xl border border-secondary/40 bg-secondary-container/30 p-md">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="check-circle" size={24} color={colors.secondary} />
                  <Text className="font-sans-bold text-title-md text-on-surface">Compte créé avec succès !</Text>
                </View>
                <Text className="font-sans text-body-md text-on-surface-variant">{successMessage}</Text>
                <Pressable
                  onPress={() => {
                    const destination = accountType === 'recruiter' ? 'RecruiterApp' : 'CandidateApp';
                    (navigation.getParent() as any)?.navigate(destination);
                  }}
                  className="mt-1 h-10 items-center justify-center rounded-lg bg-secondary"
                >
                  <Text className="font-sans-semibold text-label-lg text-white">Accéder à mon espace</Text>
                </Pressable>
              </View>
            ) : null}

            <Button
              label={loading ? 'Création en cours...' : canSubmit ? 'Créer mon compte' : 'Compléter le formulaire'}
              disabled={!canSubmit || loading || !!successMessage}
              onPress={async () => {
                if (!canSubmit || loading) return;
                setErrorMessage('');
                setSuccessMessage('');
                setLoading(true);
                try {
                  const response = await register({
                    full_name: fullName.trim(),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim(),
                    password,
                    account_type: accountType,
                    referral_code: referralCode.trim() || undefined,
                  });
                  const destination = response.account_type === 'recruiter' ? 'RecruiterApp' : 'CandidateApp';
                  await signIn(response.access_token, response.account_type, response.user_id);
                  setSuccessMessage('Bienvenue sur EmploiCamer ! Redirection vers votre espace...');
                  setTimeout(() => {
                    (navigation.getParent() as any)?.navigate(destination);
                  }, 1200);
                } catch (error) {
                  setErrorMessage((error as Error).message || 'Erreur lors de la création du compte');
                } finally {
                  setLoading(false);
                }
              }}
            />

            {/* Divider */}
            <View className="my-sm flex-row items-center gap-md">
              <View className="h-[1px] flex-1 bg-outline-variant" />
              <Text className="font-sans text-label-md uppercase tracking-wider text-on-surface-variant">
                Ou s'inscrire avec
              </Text>
              <View className="h-[1px] flex-1 bg-outline-variant" />
            </View>

            {/* Social — vraies images des logos */}
            <View className="flex-row gap-md">
              {SOCIAL_PROVIDERS.map((provider) => (
                <Pressable
                  key={provider.key}
                  className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md border border-outline-variant bg-surface"
                >
                  <Image
                    source={{ uri: provider.logo }}
                    style={{ width: 18, height: 18 }}
                    resizeMode="contain"
                  />
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{provider.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer fixe : toujours visible en bas, ne défile jamais hors de vue */}
        <View className="border-t border-outline-variant/20 bg-surface px-container-margin py-md">
          <Text className="text-center font-sans text-body-md text-on-surface-variant">
            Déjà un compte ?{' '}
            <Text
              className="font-sans-bold text-primary"
              onPress={() => navigation.navigate('Connexion')}
            >
              Se connecter
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
