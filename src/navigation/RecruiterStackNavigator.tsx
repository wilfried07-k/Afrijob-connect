import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecruiterStackParamList } from './types';
import RecruiterTabNavigator from './RecruiterNavigator';
import PublierOffreScreen from '../screens/recruiter/PublierOffreScreen';
import DetailsCandidatScreen from '../screens/recruiter/DetailsCandidatScreen';
import PlanifierEntretienScreen from '../screens/recruiter/PlanifierEntretienScreen';
import ComparaisonCandidatsScreen from '../screens/recruiter/ComparaisonCandidatsScreen';
import VerificationKycEntrepriseScreen from '../screens/recruiter/VerificationKycEntrepriseScreen';
import GestionEntretiensVideoScreen from '../screens/recruiter/GestionEntretiensVideoScreen';
import VideoconferenceEntretienScreen from '../screens/shared/VideoconferenceEntretienScreen';
import NotesEntretienScreen from '../screens/recruiter/NotesEntretienScreen';
import RedactionRapportEntretienScreen from '../screens/recruiter/RedactionRapportEntretienScreen';
import ValidationRapportRHScreen from '../screens/recruiter/ValidationRapportRHScreen';
import ParametresCompteScreen from '../screens/shared/ParametresCompteScreen';
import ParametresNotificationsScreen from '../screens/shared/ParametresNotificationsScreen';
import FacturationAbonnementScreen from '../screens/recruiter/FacturationAbonnementScreen';
import AnalytiqueRecruteurScreen from '../screens/recruiter/AnalytiqueRecruteurScreen';
import SponsoringOffresScreen from '../screens/recruiter/SponsoringOffresScreen';
import TarifsEntreprisesScreen from '../screens/recruiter/TarifsEntreprisesScreen';
import FaqRecruteursScreen from '../screens/recruiter/FaqRecruteursScreen';
import RecommandationsIARecruteurScreen from '../screens/recruiter/RecommandationsIARecruteurScreen';
import ParrainageRecruteurScreen from '../screens/recruiter/ParrainageRecruteurScreen';
import DiscussionScreen from '../screens/candidate/DiscussionScreen';
import MentionsLegalesScreen from '../screens/shared/MentionsLegalesScreen';
import CentreAssistanceScreen from '../screens/shared/CentreAssistanceScreen';
import SupportPrioritaireScreen from '../screens/shared/SupportPrioritaireScreen';
import PageErreurScreen from '../screens/shared/PageErreurScreen';
import SelectionModePaiementScreen from '../screens/shared/SelectionModePaiementScreen';
import ValidationPaiementUSSDScreen from '../screens/shared/ValidationPaiementUSSDScreen';
import PaiementReussiScreen from '../screens/shared/PaiementReussiScreen';
import AnalytiqueOffreScreen from '../screens/recruiter/AnalytiqueOffreScreen';
import DocumentsConformiteEntrepriseScreen from '../screens/recruiter/DocumentsConformiteEntrepriseScreen';
import ProfilDirigeantEntrepriseScreen from '../screens/recruiter/ProfilDirigeantEntrepriseScreen';
import CreationProfilEntrepriseScreen from '../screens/recruiter/CreationProfilEntrepriseScreen';
import GuideBonnesPratiquesScreen from '../screens/recruiter/GuideBonnesPratiquesScreen';
import FeedbackExperienceScreen from '../screens/recruiter/FeedbackExperienceScreen';
import ParametresFacturationScreen from '../screens/recruiter/ParametresFacturationScreen';
import ConfigurationRelancesScreen from '../screens/recruiter/ConfigurationRelancesScreen';
import FacturationHistoriqueScreen from '../screens/recruiter/FacturationHistoriqueScreen';
import ApprobationFacturesScreen from '../screens/recruiter/ApprobationFacturesScreen';
import BibliothequeModelesScreen from '../screens/recruiter/BibliothequeModelesScreen';
import ExportationRapportScreen from '../screens/shared/ExportationRapportScreen';
import DeclarationEmbaucheScreen from '../screens/recruiter/DeclarationEmbaucheScreen';
import PaiementCotisationsCNPSScreen from '../screens/recruiter/PaiementCotisationsCNPSScreen';
import AttestationCNPSScreen from '../screens/recruiter/AttestationCNPSScreen';

const Stack = createNativeStackNavigator<RecruiterStackParamList>();

/**
 * Enveloppe les onglets recruteur (`RecruiterNavigator`) et ajoute tous les
 * écrans poussés par-dessus.
 */
export default function RecruiterStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecruiterTabs" component={RecruiterTabNavigator} />
      <Stack.Screen name="PublierOffre" component={PublierOffreScreen} />
      <Stack.Screen name="DetailsCandidat" component={DetailsCandidatScreen} />
      <Stack.Screen name="PlanifierEntretien" component={PlanifierEntretienScreen} />
      <Stack.Screen name="ComparaisonCandidats" component={ComparaisonCandidatsScreen} />
      <Stack.Screen name="VerificationKycEntreprise" component={VerificationKycEntrepriseScreen} />
      <Stack.Screen name="GestionEntretiensVideo" component={GestionEntretiensVideoScreen} />
      <Stack.Screen name="VideoconferenceEntretien" component={VideoconferenceEntretienScreen as any} />
      <Stack.Screen name="NotesEntretien" component={NotesEntretienScreen} />
      <Stack.Screen name="RedactionRapportEntretien" component={RedactionRapportEntretienScreen} />
      <Stack.Screen name="ValidationRapportRH" component={ValidationRapportRHScreen} />
      <Stack.Screen name="ParametresCompte" component={ParametresCompteScreen as any} />
      <Stack.Screen name="ParametresNotifications" component={ParametresNotificationsScreen as any} />
      <Stack.Screen name="FacturationAbonnement" component={FacturationAbonnementScreen as any} />
      <Stack.Screen name="AnalytiqueRecruteur" component={AnalytiqueRecruteurScreen as any} />
      <Stack.Screen name="SponsoringOffres" component={SponsoringOffresScreen as any} />
      <Stack.Screen name="TarifsEntreprises" component={TarifsEntreprisesScreen as any} />
      <Stack.Screen name="FaqRecruteurs" component={FaqRecruteursScreen as any} />
      <Stack.Screen name="RecommandationsIARecruteur" component={RecommandationsIARecruteurScreen as any} />
      <Stack.Screen name="ParrainageRecruteur" component={ParrainageRecruteurScreen as any} />
      <Stack.Screen name="DiscussionRecruteur" component={DiscussionScreen as any} />
      <Stack.Screen name="MentionsLegales" component={MentionsLegalesScreen as any} />
      <Stack.Screen name="CentreAssistance" component={CentreAssistanceScreen as any} />
      <Stack.Screen name="SupportPrioritaire" component={SupportPrioritaireScreen as any} />
      <Stack.Screen name="PageErreur" component={PageErreurScreen as any} />
      <Stack.Screen name="SelectionModePaiement" component={SelectionModePaiementScreen as any} />
      <Stack.Screen name="ValidationPaiementUSSD" component={ValidationPaiementUSSDScreen as any} />
      <Stack.Screen name="PaiementReussi" component={PaiementReussiScreen as any} />
      <Stack.Screen name="AnalytiqueOffre" component={AnalytiqueOffreScreen as any} />
      <Stack.Screen name="DocumentsConformiteEntreprise" component={DocumentsConformiteEntrepriseScreen as any} />
      <Stack.Screen name="ProfilDirigeantEntreprise" component={ProfilDirigeantEntrepriseScreen as any} />
      <Stack.Screen name="CreationProfilEntreprise" component={CreationProfilEntrepriseScreen as any} />
      <Stack.Screen name="GuideBonnesPratiques" component={GuideBonnesPratiquesScreen as any} />
      <Stack.Screen name="FeedbackExperience" component={FeedbackExperienceScreen as any} />
      <Stack.Screen name="ParametresFacturation" component={ParametresFacturationScreen as any} />
      <Stack.Screen name="ConfigurationRelances" component={ConfigurationRelancesScreen as any} />
      <Stack.Screen name="FacturationHistorique" component={FacturationHistoriqueScreen as any} />
      <Stack.Screen name="ApprobationFactures" component={ApprobationFacturesScreen as any} />
      <Stack.Screen name="BibliothequeModeles" component={BibliothequeModelesScreen as any} />
      <Stack.Screen name="ExportationRapport" component={ExportationRapportScreen as any} />
      <Stack.Screen name="DeclarationEmbauche" component={DeclarationEmbaucheScreen as any} />
      <Stack.Screen name="PaiementCotisationsCNPS" component={PaiementCotisationsCNPSScreen as any} />
      <Stack.Screen name="AttestationCNPS" component={AttestationCNPSScreen as any} />
    </Stack.Navigator>
  );
}
