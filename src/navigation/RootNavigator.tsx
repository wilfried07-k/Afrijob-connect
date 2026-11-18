import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from './types';
import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import CandidateStackNavigator from './CandidateStackNavigator';
import RecruiterStackNavigator from './RecruiterStackNavigator';
import AdminStackNavigator from './AdminStackNavigator';
import { useAuth } from '../lib/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function RootNavigator() {
  const { authState, isReady } = useAuth();
  if (!isReady) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }
  const initialRouteName: keyof RootStackParamList = authState.accountType === 'candidate'
    ? 'CandidateApp'
    : authState.accountType === 'recruiter'
      ? 'RecruiterApp'
      : authState.accountType === 'admin'
        ? 'AdminApp'
        : 'Onboarding';
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="CandidateApp" component={CandidateStackNavigator} />
      <Stack.Screen name="RecruiterApp" component={RecruiterStackNavigator} />
      <Stack.Screen name="AdminApp" component={AdminStackNavigator} />
    </Stack.Navigator>
  );
}
