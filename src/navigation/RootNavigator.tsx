import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import CandidateStackNavigator from './CandidateStackNavigator';
import RecruiterStackNavigator from './RecruiterStackNavigator';
import AdminStackNavigator from './AdminStackNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="CandidateApp" component={CandidateStackNavigator} />
      <Stack.Screen name="RecruiterApp" component={RecruiterStackNavigator} />
      <Stack.Screen name="AdminApp" component={AdminStackNavigator} />
    </Stack.Navigator>
  );
}
