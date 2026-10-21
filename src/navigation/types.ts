import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Types de navigation centralisÃ©s.
 * Ajoute ici chaque nouvel Ã©cran au fur et Ã  mesure de la conversion des maquettes.
 */

export type OnboardingStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
};

export type AuthStackParamList = {
  Connexion: undefined;
  Inscription: undefined;
  VerificationOtp: { email?: string; phone?: string } | undefined;
  ChoixTypeCompte: undefined;
};

export type CandidateTabParamList = {
  TableauDeBord: undefined;
  RechercheAvancee: undefined;
  Messages: undefined;
  Favoris: undefined;
  Profil: undefined;
};


export type CandidateStackParamList = {
  CandidateTabs: NavigatorScreenParams<CandidateTabParamList> | undefined;
  DetailOffre: { jobId?: number; title?: string; company?: string } | undefined;
  CandidatureRapide: { jobId?: number; title?: string; company?: string } | undefined;
  CandidatureEnvoyee: { company?: string } | undefined;
  SuiviCandidatures: undefined;
  CreationProfilCandidat: undefined;
  ProfilPublicCandidat: { candidateId?: number } | undefined;
  CandidatureSpontanee: { company?: string } | undefined;
  ConfirmationEntretien: { company?: string; position?: string } | undefined;
  CalendrierCandidat: undefined;
  CoffreFortDocuments: undefined;
  PreparationEntretienVideo: { company?: string; position?: string } | undefined;
  VideoconferenceEntretien: { name?: string; role?: string; asRecruiter?: boolean } | undefined;
  ParametresCompte: undefined;
  ParametresNotifications: undefined;
  Notifications: undefined;
  GestionAlertesEmploi: undefined;
  CreerAlerteEmploi: { alertId?: number; title?: string } | undefined;
  DetailsAlerteEmploi: { alertId?: number; title?: string; location?: string } | undefined;
  ComparaisonSalaires: undefined;
  CoachingCarriereIA: undefined;
  ConseilsCarriere: undefined;
  TestDeCompetences: undefined;
  PortfolioProjets: undefined;
  ReseauProfessionnel: undefined;
  AvisCultureEntreprise: { company?: string; companyId?: number } | undefined;
  Parrainage: undefined;
  DiscussionCandidat: { conversationId?: number; company?: string } | undefined;
  DetailsCandidature: { applicationId?: number; title?: string; company?: string } | undefined;
  MentionsLegales: undefined;
  CentreAssistance: undefined;
  SupportPrioritaire: undefined;
  PageErreur: { type?: 'maintenance' | 'error' | 'offline' } | undefined;
  MonCVDocuments: undefined;
  ResultatsCertification: { assessmentId: number } | undefined;
  RedactionAssisteeIA: undefined;
  CentrePreferences: undefined;
  MesRecompensesParrainage: undefined;
  ReleveCarriere: undefined;
};

export type RecruiterTabParamList = {
  TableauDeBordRecruteur: undefined;
  GestionDesOffres: undefined;
  GestionDesCandidats: undefined;
  Statistiques: undefined;
  ProfilEntreprise: undefined;
};

export type RecruiterStackParamList = {
  RecruiterTabs: NavigatorScreenParams<RecruiterTabParamList> | undefined;
  PublierOffre: undefined;
  DetailsCandidat: { applicationId?: number; candidateId?: number; name?: string; role?: string; matchScore?: number } | undefined;
  PlanifierEntretien: { applicationId?: number; candidateName?: string; role?: string } | undefined;
  ComparaisonCandidats: undefined;
  VerificationKycEntreprise: undefined;
  GestionEntretiensVideo: undefined;
  VideoconferenceEntretien: { name?: string; role?: string; asRecruiter?: boolean } | undefined;
  NotesEntretien: { interviewId?: number; candidateName?: string; role?: string } | undefined;
  RedactionRapportEntretien: { interviewId?: number; candidateName?: string; role?: string } | undefined;
  ValidationRapportRH: { interviewId?: number; candidateName?: string; role?: string } | undefined;
  ParametresCompte: undefined;
  ParametresNotifications: undefined;
  FacturationAbonnement: undefined;
  AnalytiqueRecruteur: undefined;
  SponsoringOffres: undefined;
  TarifsEntreprises: undefined;
  FaqRecruteurs: undefined;
  RecommandationsIARecruteur: undefined;
  ParrainageRecruteur: undefined;
  DiscussionRecruteur: { company?: string } | undefined;
  MentionsLegales: undefined;
  CentreAssistance: undefined;
  SupportPrioritaire: undefined;
  PageErreur: { type?: 'maintenance' | 'error' | 'offline' } | undefined;
  SelectionModePaiement: undefined;
  ValidationPaiementUSSD: { paymentId: number; method: string; amount: number };
  PaiementReussi: { paymentId: number };
  AnalytiqueOffre: { title?: string } | undefined;
  DocumentsConformiteEntreprise: undefined;
  ProfilDirigeantEntreprise: undefined;
  CreationProfilEntreprise: undefined;
  GuideBonnesPratiques: undefined;
  FeedbackExperience: undefined;
  ParametresFacturation: undefined;
  ConfigurationRelances: undefined;
  FacturationHistorique: undefined;
  ApprobationFactures: undefined;
  BibliothequeModeles: undefined;
  ExportationRapport: undefined;
  DeclarationEmbauche: { candidateId?: number; candidateName?: string; role?: string } | undefined;
  PaiementCotisationsCNPS: undefined;
  AttestationCNPS: undefined;
};

export type AdminTabParamList = {
  TableauDeBordAdmin: undefined;
  ModerationLitiges: undefined;
  ModerationKYC: undefined;
  GestionBannissements: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  DashboardPaiements: undefined;
  GestionRemboursements: undefined;
  JournalAudit: undefined;
  TableauDeBordConformite: undefined;
  DashboardMarketing: undefined;
  GestionContentieuxAvance: undefined;
  DecisionArbitrageFinal: undefined;
  GestionAccesRH: undefined;
  RapportSecuriteMensuel: undefined;
  GestionCampagnesSMSEmail: undefined;
  CiblageCampagnePush: { campaignId?: number; campaignName?: string } | undefined;
  ConfirmationEnvoiCampagne: { campaignId: number; campaignName: string } | undefined;
  SuiviPerformancesCampagne: { campaignId: number; campaignName: string } | undefined;
  GestionEquipesAgents: undefined;
  TableauDeBordSupervision: undefined;
  KYCAgentTerrain: undefined;
  DetailsMissionTerrain: undefined;
  ModerationOffresFrauduleuses: undefined;
  JournalAuditFinancier: undefined;
  BannissementDefinitif: { name?: string } | undefined;
  FaqSecurite: undefined;
  GestionRemises: undefined;
  RapportMarketingTrimestriel: undefined;
  ExportationRapport: undefined;
  TableauDeBordCNPS: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  CandidateApp: undefined;
  RecruiterApp: undefined;
  AdminApp: undefined;
};