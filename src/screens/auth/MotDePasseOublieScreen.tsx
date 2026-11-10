import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { requestPasswordReset, resetPassword } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'MotDePasseOublie'>;

export default function MotDePasseOublieScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Adresse requise', 'Saisissez l’adresse email de votre compte.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setCodeRequested(true);
      Alert.alert('Vérifiez votre boîte mail', 'Si un compte correspond à cette adresse, un code y a été envoyé.');
    } catch (error) {
      Alert.alert('Demande impossible', (error as Error).message || 'Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (!/^\d{6}$/.test(code) || newPassword.length < 8) {
      Alert.alert('Informations incorrectes', 'Saisissez le code à 6 chiffres et un mot de passe d’au moins 8 caractères.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim(), code, newPassword);
      Alert.alert('Mot de passe réinitialisé', 'Vous pouvez maintenant vous connecter.', [
        { text: 'Se connecter', onPress: () => navigation.navigate('Connexion') },
      ]);
    } catch (error) {
      Alert.alert('Code refusé', (error as Error).message || 'Le code est invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 px-container-margin">
        <View className="h-16 flex-row items-center gap-3"><Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable><Text className="font-sans-bold text-headline-md text-primary">Mot de passe oublié</Text></View>
        <View className="gap-lg pt-xl">
          <Text className="font-sans text-body-lg text-on-surface-variant">Recevez un code temporaire par email pour choisir un nouveau mot de passe.</Text>
          <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Adresse email</Text><TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} editable={!codeRequested} placeholder="nom@exemple.cm" placeholderTextColor={colors.outline} className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-md font-sans text-body-md text-on-surface" /></View>
          {!codeRequested ? <Pressable disabled={loading} onPress={() => void sendCode()} className="h-12 items-center justify-center rounded-lg bg-primary">{loading ? <ActivityIndicator color="#fff" /> : <Text className="font-sans-semibold text-label-lg text-on-primary">Envoyer le code</Text>}</Pressable> : <>
            <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Code reçu</Text><TextInput value={code} onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" maxLength={6} placeholder="000000" placeholderTextColor={colors.outline} className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-md font-sans text-body-md text-on-surface" /></View>
            <View className="gap-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Nouveau mot de passe</Text><TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry autoCapitalize="none" placeholder="8 caractères minimum" placeholderTextColor={colors.outline} className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-md font-sans text-body-md text-on-surface" /></View>
            <Pressable disabled={loading} onPress={() => void savePassword()} className="h-12 items-center justify-center rounded-lg bg-primary">{loading ? <ActivityIndicator color="#fff" /> : <Text className="font-sans-semibold text-label-lg text-on-primary">Réinitialiser le mot de passe</Text>}</Pressable>
            <Pressable disabled={loading} onPress={() => void sendCode()} className="items-center py-2"><Text className="font-sans-semibold text-label-md text-primary">Renvoyer le code</Text></Pressable>
          </>}
        </View>
      </View>
    </Screen>
  );
}