import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CandidateStackParamList } from './types';
import CandidateTabNavigator from './CandidateNavigator';
import DetailOffreScreen from '../screens/candidate/DetailOffreScreen';
import CandidatureRapideScreen from '../screens/candidate/CandidatureRapideScreen';
import CandidatureEnvoyeeScreen from '../screens/candidate/CandidatureEnvoyeeScreen';
import SuiviCandidaturesScreen from '../screens/candidate/SuiviCandidaturesScreen';
import CreationProfilCandidatScreen from '../screens/candidate/CreationProfilCandidatScreen';
import ProfilPublicCandidatScreen from '../screens/candidate/ProfilPublicCandidatScreen';
import CandidatureSpontaneeScreen from '../screens/candidate/CandidatureSpontaneeScreen';
import ConfirmationEntretienScreen from '../screens/candidate/ConfirmationEntretienScreen';
import CalendrierCandidatScreen from '../screens/candidate/CalendrierCandidatScreen';
import CoffreFortDocumentsScreen from '../screens/candidate/CoffreFortDocumentsScreen';
import PreparationEntretienVideoScreen from '../screens/candidate/PreparationEntretienVideoScreen';
import VideoconferenceEntretienScreen from '../screens/shared/VideoconferenceEntretienScreen';
import ParametresCompteScreen from '../screens/shared/ParametresCompteScreen';
import ParametresNotificationsScreen from '../screens/shared/ParametresNotificationsScreen';
import NotificationsScreen from '../screens/candidate/NotificationsScreen';
import GestionAlertesEmploiScreen from '../screens/candidate/GestionAlertesEmploiScreen';
import CreerAlerteEmploiScreen from '../screens/candidate/CreerAlerteEmploiScreen';
import ComparaisonSalairesScreen from '../screens/candidate/ComparaisonSalairesScreen';
import CoachingCarriereIAScreen from '../screens/candidate/CoachingCarriereIAScreen';
import ConseilsCarriereScreen from '../screens/candidate/ConseilsCarriereScreen';
import TestDeCompetencesScreen from '../screens/candidate/TestDeCompetencesScreen';
import PortfolioProjetsScreen from '../screens/candidate/PortfolioProjetsScreen';
import ReseauProfessionnelScreen from '../screens/candidate/ReseauProfessionnelScreen';
import AvisCultureEntrepriseScreen from '../screens/candidate/AvisCultureEntrepriseScreen';
import ParrainageScreen from '../screens/candidate/ParrainageScreen';
import DiscussionScreen from '../screens/candidate/DiscussionScreen';
import DetailsCandidatureScreen from '../screens/candidate/DetailsCandidatureScreen';
import MentionsLegalesScreen from '../screens/shared/MentionsLegalesScreen';
import CentreAssistanceScreen from '../screens/shared/CentreAssistanceScreen';
import SupportPrioritaireScreen from '../screens/shared/SupportPrioritaireScreen';
import PageErreurScreen from '../screens/shared/PageErreurScreen';
import DetailsAlerteEmploiScreen from '../screens/candidate/DetailsAlerteEmploiScreen';
import MonCVDocumentsScreen from '../screens/candidate/MonCVDocumentsScreen';
import ResultatsCertificationScreen from '../screens/candidate/ResultatsCertificationScreen';
import RedactionAssisteeIAScreen from '../screens/shared/RedactionAssisteeIAScreen';
import CentrePreferencesScreen from '../screens/shared/CentrePreferencesScreen';
import MesRecompensesParrainageScreen from '../screens/candidate/MesRecompensesParrainageScreen';
import ReleveCarriereScreen from '../screens/candidate/ReleveCarriereScreen';

const Stack = createNativeStackNavigator<CandidateStackParamList>();

/**
 * Enveloppe les onglets candidat (`CandidateNavigator`) et ajoute tous les
 * écrans poussés par-dessus.
 */
export default function CandidateStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CandidateTabs" component={CandidateTabNavigator} />
      <Stack.Screen name="DetailOffre" component={DetailOffreScreen} />
      <Stack.Screen name="CandidatureRapide" component={CandidatureRapideScreen} />
      <Stack.Screen name="CandidatureEnvoyee" component={CandidatureEnvoyeeScreen} />
      <Stack.Screen name="SuiviCandidatures" component={SuiviCandidaturesScreen} />
      <Stack.Screen name="CreationProfilCandidat" component={CreationProfilCandidatScreen} />
      <Stack.Screen name="ProfilPublicCandidat" component={ProfilPublicCandidatScreen} />
      <Stack.Screen name="CandidatureSpontanee" component={CandidatureSpontaneeScreen} />
      <Stack.Screen name="ConfirmationEntretien" component={ConfirmationEntretienScreen} />
      <Stack.Screen name="CalendrierCandidat" component={CalendrierCandidatScreen} />
      <Stack.Screen name="CoffreFortDocuments" component={CoffreFortDocumentsScreen} />
      <Stack.Screen name="PreparationEntretienVideo" component={PreparationEntretienVideoScreen} />
      <Stack.Screen name="VideoconferenceEntretien" component={VideoconferenceEntretienScreen as any} />
      <Stack.Screen name="ParametresCompte" component={ParametresCompteScreen as any} />
      <Stack.Screen name="ParametresNotifications" component={ParametresNotificationsScreen as any} />
      <Stack.Screen name="Notifications" component={NotificationsScreen as any} />
      <Stack.Screen name="GestionAlertesEmploi" component={GestionAlertesEmploiScreen as any} />
      <Stack.Screen name="CreerAlerteEmploi" component={CreerAlerteEmploiScreen as any} />
      <Stack.Screen name="ComparaisonSalaires" component={ComparaisonSalairesScreen as any} />
      <Stack.Screen name="CoachingCarriereIA" component={CoachingCarriereIAScreen as any} />
      <Stack.Screen name="ConseilsCarriere" component={ConseilsCarriereScreen as any} />
      <Stack.Screen name="TestDeCompetences" component={TestDeCompetencesScreen as any} />
      <Stack.Screen name="PortfolioProjets" component={PortfolioProjetsScreen as any} />
      <Stack.Screen name="ReseauProfessionnel" component={ReseauProfessionnelScreen as any} />
      <Stack.Screen name="AvisCultureEntreprise" component={AvisCultureEntrepriseScreen as any} />
      <Stack.Screen name="Parrainage" component={ParrainageScreen as any} />
      <Stack.Screen name="DiscussionCandidat" component={DiscussionScreen as any} />
      <Stack.Screen name="DetailsCandidature" component={DetailsCandidatureScreen as any} />
      <Stack.Screen name="MentionsLegales" component={MentionsLegalesScreen as any} />
      <Stack.Screen name="CentreAssistance" component={CentreAssistanceScreen as any} />
      <Stack.Screen name="SupportPrioritaire" component={SupportPrioritaireScreen as any} />
      <Stack.Screen name="PageErreur" component={PageErreurScreen as any} />
      <Stack.Screen name="DetailsAlerteEmploi" component={DetailsAlerteEmploiScreen as any} />
      <Stack.Screen name="MonCVDocuments" component={MonCVDocumentsScreen as any} />
      <Stack.Screen name="ResultatsCertification" component={ResultatsCertificationScreen as any} />
      <Stack.Screen name="RedactionAssisteeIA" component={RedactionAssisteeIAScreen as any} />
      <Stack.Screen name="CentrePreferences" component={CentrePreferencesScreen as any} />
      <Stack.Screen name="MesRecompensesParrainage" component={MesRecompensesParrainageScreen as any} />
      <Stack.Screen name="ReleveCarriere" component={ReleveCarriereScreen as any} />
    </Stack.Navigator>
  );
}
