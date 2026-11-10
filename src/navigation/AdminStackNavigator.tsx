import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';
import AdminTabNavigator from './AdminNavigator';
import DashboardPaiementsScreen from '../screens/admin/DashboardPaiementsScreen';
import GestionRemboursementsScreen from '../screens/admin/GestionRemboursementsScreen';
import JournalAuditScreen from '../screens/admin/JournalAuditScreen';
import TableauDeBordConformiteScreen from '../screens/admin/TableauDeBordConformiteScreen';
import DashboardMarketingScreen from '../screens/admin/DashboardMarketingScreen';
import GestionContentieuxAvanceScreen from '../screens/admin/GestionContentieuxAvanceScreen';
import DecisionArbitrageFinalScreen from '../screens/admin/DecisionArbitrageFinalScreen';
import GestionAccesRHScreen from '../screens/admin/GestionAccesRHScreen';
import RapportSecuriteMensuelScreen from '../screens/admin/RapportSecuriteMensuelScreen';
import GestionCampagnesSMSEmailScreen from '../screens/admin/GestionCampagnesSMSEmailScreen';
import CiblageCampagnePushScreen from '../screens/admin/CiblageCampagnePushScreen';
import ConfirmationEnvoiCampagneScreen from '../screens/admin/ConfirmationEnvoiCampagneScreen';
import SuiviPerformancesCampagneScreen from '../screens/admin/SuiviPerformancesCampagneScreen';
import GestionEquipesAgentsScreen from '../screens/admin/GestionEquipesAgentsScreen';
import TableauDeBordSupervisionScreen from '../screens/admin/TableauDeBordSupervisionScreen';
import KYCAgentTerrainScreen from '../screens/admin/KYCAgentTerrainScreen';
import DetailsMissionTerrainScreen from '../screens/admin/DetailsMissionTerrainScreen';
import ModerationOffresFrauduleusesScreen from '../screens/admin/ModerationOffresFrauduleusesScreen';
import JournalAuditFinancierScreen from '../screens/admin/JournalAuditFinancierScreen';
import BannissementDefinitifScreen from '../screens/admin/BannissementDefinitifScreen';
import FaqSecuriteScreen from '../screens/admin/FaqSecuriteScreen';
import GestionRemisesScreen from '../screens/admin/GestionRemisesScreen';
import RapportMarketingTrimestrielScreen from '../screens/admin/RapportMarketingTrimestrielScreen';
import ExportationRapportScreen from '../screens/shared/ExportationRapportScreen';
import TableauDeBordCNPSScreen from '../screens/admin/TableauDeBordCNPSScreen';
import GestionUtilisateursScreen from '../screens/admin/GestionUtilisateursScreen';
import OffresOuvertesScreen from '../screens/admin/OffresOuvertesScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

/**
 * Enveloppe les onglets admin (`AdminNavigator`) et ajoute tous les écrans
 * poussés par-dessus.
 */
export default function AdminStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
      <Stack.Screen name="GestionUtilisateurs" component={GestionUtilisateursScreen} />
      <Stack.Screen name="OffresOuvertes" component={OffresOuvertesScreen} />
      <Stack.Screen name="DashboardPaiements" component={DashboardPaiementsScreen} />
      <Stack.Screen name="GestionRemboursements" component={GestionRemboursementsScreen} />
      <Stack.Screen name="JournalAudit" component={JournalAuditScreen} />
      <Stack.Screen name="TableauDeBordConformite" component={TableauDeBordConformiteScreen} />
      <Stack.Screen name="DashboardMarketing" component={DashboardMarketingScreen} />
      <Stack.Screen name="GestionContentieuxAvance" component={GestionContentieuxAvanceScreen as any} />
      <Stack.Screen name="DecisionArbitrageFinal" component={DecisionArbitrageFinalScreen as any} />
      <Stack.Screen name="GestionAccesRH" component={GestionAccesRHScreen as any} />
      <Stack.Screen name="RapportSecuriteMensuel" component={RapportSecuriteMensuelScreen as any} />
      <Stack.Screen name="GestionCampagnesSMSEmail" component={GestionCampagnesSMSEmailScreen as any} />
      <Stack.Screen name="CiblageCampagnePush" component={CiblageCampagnePushScreen as any} />
      <Stack.Screen name="ConfirmationEnvoiCampagne" component={ConfirmationEnvoiCampagneScreen as any} />
      <Stack.Screen name="SuiviPerformancesCampagne" component={SuiviPerformancesCampagneScreen as any} />
      <Stack.Screen name="GestionEquipesAgents" component={GestionEquipesAgentsScreen as any} />
      <Stack.Screen name="TableauDeBordSupervision" component={TableauDeBordSupervisionScreen as any} />
      <Stack.Screen name="KYCAgentTerrain" component={KYCAgentTerrainScreen as any} />
      <Stack.Screen name="DetailsMissionTerrain" component={DetailsMissionTerrainScreen as any} />
      <Stack.Screen name="ModerationOffresFrauduleuses" component={ModerationOffresFrauduleusesScreen as any} />
      <Stack.Screen name="JournalAuditFinancier" component={JournalAuditFinancierScreen as any} />
      <Stack.Screen name="BannissementDefinitif" component={BannissementDefinitifScreen as any} />
      <Stack.Screen name="FaqSecurite" component={FaqSecuriteScreen as any} />
      <Stack.Screen name="GestionRemises" component={GestionRemisesScreen as any} />
      <Stack.Screen name="RapportMarketingTrimestriel" component={RapportMarketingTrimestrielScreen as any} />
      <Stack.Screen name="ExportationRapport" component={ExportationRapportScreen as any} />
      <Stack.Screen name="TableauDeBordCNPS" component={TableauDeBordCNPSScreen as any} />
    </Stack.Navigator>
  );
}
