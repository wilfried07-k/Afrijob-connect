import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminTabParamList } from './types';
import { colors } from '../theme';
import TableauDeBordAdminScreen from '../screens/admin/TableauDeBordAdminScreen';
import ModerationLitigesScreen from '../screens/admin/ModerationLitigesScreen';
import ModerationKYCScreen from '../screens/admin/ModerationKYCScreen';
import GestionBannissementsScreen from '../screens/admin/GestionBannissementsScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();

const ICONS: Record<keyof AdminTabParamList, keyof typeof MaterialIcons.glyphMap> = {
  TableauDeBordAdmin: 'dashboard',
  ModerationLitiges: 'gavel',
  ModerationKYC: 'fact-check',
  GestionBannissements: 'block',
};

export default function AdminNavigator() {
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
      <Tab.Screen name="TableauDeBordAdmin" component={TableauDeBordAdminScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="ModerationLitiges" component={ModerationLitigesScreen} options={{ title: 'Modération' }} />
      <Tab.Screen name="ModerationKYC" component={ModerationKYCScreen} options={{ title: 'KYC' }} />
      <Tab.Screen name="GestionBannissements" component={GestionBannissementsScreen} options={{ title: 'Bannis' }} />
    </Tab.Navigator>
  );
}
