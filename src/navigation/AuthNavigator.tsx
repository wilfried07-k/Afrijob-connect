import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import ConnexionScreen from '../screens/auth/ConnexionScreen';
import InscriptionScreen from '../screens/auth/InscriptionScreen';
import VerificationOtpScreen from '../screens/auth/VerificationOtpScreen';
import ChoixTypeCompteScreen from '../screens/auth/ChoixTypeCompteScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Connexion" component={ConnexionScreen} />
      <Stack.Screen name="Inscription" component={InscriptionScreen} />
      <Stack.Screen name="VerificationOtp" component={VerificationOtpScreen} />
      <Stack.Screen name="ChoixTypeCompte" component={ChoixTypeCompteScreen} />
    </Stack.Navigator>
  );
}
