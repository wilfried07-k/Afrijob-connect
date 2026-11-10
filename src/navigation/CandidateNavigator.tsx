import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { CandidateTabParamList } from './types';
import { colors } from '../theme';
import TableauDeBordScreen from '../screens/candidate/TableauDeBordScreen';
import RechercheAvanceeScreen from '../screens/candidate/RechercheAvanceeScreen';
import MessagesScreen from '../screens/candidate/MessagesScreen';
import FavorisScreen from '../screens/candidate/FavorisScreen';
import ProfilScreen from '../screens/candidate/ProfilScreen';
import { useLanguage } from '../theme/language';

const Tab = createBottomTabNavigator<CandidateTabParamList>();

const ICONS: Record<keyof CandidateTabParamList, keyof typeof MaterialIcons.glyphMap> = {
  TableauDeBord: 'home',
  RechercheAvancee: 'search',
  Messages: 'chat-bubble-outline',
  Favoris: 'favorite-border',
  Profil: 'person-outline',
};

export default function CandidateNavigator() {
  const { t } = useLanguage();
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
      <Tab.Screen name="TableauDeBord" component={TableauDeBordScreen} options={{ title: t('Accueil') }} />
      <Tab.Screen name="RechercheAvancee" component={RechercheAvanceeScreen} options={{ title: t('Recherche') }} />
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ title: t('Messages') }} />
      <Tab.Screen name="Favoris" component={FavorisScreen} options={{ title: t('Favoris') }} />
      <Tab.Screen name="Profil" component={ProfilScreen} options={{ title: t('Profil') }} />
    </Tab.Navigator>
  );
}
