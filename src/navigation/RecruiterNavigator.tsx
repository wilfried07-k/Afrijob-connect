import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { RecruiterTabParamList } from './types';
import { colors } from '../theme';
import TableauDeBordRecruteurScreen from '../screens/recruiter/TableauDeBordRecruteurScreen';
import GestionDesOffresScreen from '../screens/recruiter/GestionDesOffresScreen';
import GestionDesCandidatsScreen from '../screens/recruiter/GestionDesCandidatsScreen';
import StatistiquesScreen from '../screens/recruiter/StatistiquesScreen';
import ProfilEntrepriseScreen from '../screens/recruiter/ProfilEntrepriseScreen';

const Tab = createBottomTabNavigator<RecruiterTabParamList>();

const ICONS: Record<keyof RecruiterTabParamList, keyof typeof MaterialIcons.glyphMap> = {
  TableauDeBordRecruteur: 'dashboard',
  GestionDesOffres: 'work-outline',
  GestionDesCandidats: 'people-outline',
  Statistiques: 'bar-chart',
  ProfilEntreprise: 'business',
};

export default function RecruiterNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="TableauDeBordRecruteur" component={TableauDeBordRecruteurScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="GestionDesOffres" component={GestionDesOffresScreen} options={{ title: 'Offres' }} />
      <Tab.Screen name="GestionDesCandidats" component={GestionDesCandidatsScreen} options={{ title: 'Candidats' }} />
      <Tab.Screen name="Statistiques" component={StatistiquesScreen} options={{ title: 'Stats' }} />
      <Tab.Screen name="ProfilEntreprise" component={ProfilEntrepriseScreen} options={{ title: 'Entreprise' }} />
    </Tab.Navigator>
  );
}
