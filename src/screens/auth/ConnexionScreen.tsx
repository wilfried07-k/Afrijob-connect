import { useState } from 'react';
import { View, Text, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import { colors } from '../../theme';
import { login, LoginAccountType } from '../../lib/api';
import { useAuth } from '../../lib/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Connexion'>;

// Vrais logos des fournisseurs (PNG hotlink via icons8, gratuit pour usage faible volume).
// Pour la production, télécharge ces images et mets-les dans /assets pour un require() local,
// plus fiable qu'un lien externe.
const SOCIAL_PROVIDERS = [
  { key: 'google', label: 'Google', logo: 'https://img.icons8.com/color/96/google-logo.png' },
  { key: 'facebook', label: 'Facebook', logo: 'https://img.icons8.com/color/96/facebook-new.png' },
  { key: 'apple', label: 'Apple', logo: 'https://img.icons8.com/ios-filled/100/mac-os.png' },
] as const;

export default function ConnexionScreen({ navigation }: Props) {
  const [accountType, setAccountType] = useState<LoginAccountType>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login({
        email,
        password,
        account_type: accountType,
      });

      await signIn(response.access_token, response.account_type, response.user_id);

      if (response.account_type === 'candidate') {
        (navigation.getParent() as any)?.navigate('CandidateApp');
      } else if (response.account_type === 'recruiter') {
        (navigation.getParent() as any)?.navigate('RecruiterApp');
      } else if (response.account_type === 'admin') {
        (navigation.getParent() as any)?.navigate('AdminApp');
      } else {
        Alert.alert('Type de compte invalide', 'Impossible de déterminer la destination après connexion.');
      }
    } catch (error) {
      Alert.alert('Erreur de connexion', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-container-margin"
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Header */}
          <View className="mb-xl items-center gap-md">
            <View className="mb-1 h-16 w-16 -rotate-3 items-center justify-center rounded-lg bg-primary-container shadow-lg">
              <MaterialIcons name="work" size={32} color={colors.onPrimaryContainer} />
            </View>
            <Text className="font-sans-bold text-[32px] tracking-tight text-primary">
              EmploiCamer
            </Text>
            <Text className="max-w-[280px] text-center font-sans text-body-lg text-on-surface-variant">
              Propulsez votre carrière vers de nouveaux horizons.
            </Text>
          </View>

          {/* Account type selector */}
          <View className="mb-lg flex-row gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-1.5 shadow-sm">
            {(['candidate', 'recruiter', 'admin'] as LoginAccountType[]).map((type) => {
              const active = type === accountType;
              const label = type === 'candidate' ? 'Candidat' : type === 'recruiter' ? 'Recruteur' : 'Admin';
              return (
                <Pressable
                  key={type}
                  onPress={() => setAccountType(type)}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                    active ? 'bg-primary-container' : ''
                  }`}
                >
                  <MaterialIcons
                    name={type === 'candidate' ? 'work' : type === 'recruiter' ? 'business' : 'security'}
                    size={18}
                    color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant}
                  />
                  <Text
                    className={`font-sans-semibold text-label-lg ${
                      active ? 'text-on-primary-container' : 'text-on-surface-variant'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Form Card */}
          <View className="gap-lg rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-lg">
            <View className="gap-md">
              <TextField
                label="Adresse Email"
                icon="mail"
                placeholder="nom@exemple.cm"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <View>
                <View className="mb-xs flex-row items-center justify-between px-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface-variant">
                    Mot de passe
                  </Text>
                  <Pressable>
                    <Text className="font-sans-medium text-label-md text-primary">
                      Mot de passe oublié ?
                    </Text>
                  </Pressable>
                </View>
                <TextField
                  label=""
                  icon="lock"
                  isPassword
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Button
                label={loading ? 'Connexion...' : 'Se connecter'}
                onPress={handleLogin}
                disabled={loading}
              />
            </View>

            {/* Divider */}
            <View className="flex-row items-center gap-md">
              <View className="h-[1px] flex-1 bg-outline-variant" />
              <Text className="font-sans text-label-md text-on-surface-variant">
                Ou continuer avec
              </Text>
              <View className="h-[1px] flex-1 bg-outline-variant" />
            </View>

            {/* Social logins — vraies images des logos */}
            <View className="flex-row gap-md">
              {SOCIAL_PROVIDERS.map((provider) => (
                <Pressable
                  key={provider.key}
                  className="h-14 flex-1 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-low"
                >
                  <Image
                    source={{ uri: provider.logo }}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Footer */}
          <Text className="mt-lg text-center font-sans text-body-md text-on-surface-variant">
            Nouveau ici ?{' '}
            <Text
              className="font-sans-bold text-primary"
              onPress={() => navigation.navigate('Inscription')}
            >
              S'inscrire
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
