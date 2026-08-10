/**
 * Types de navigation centralisés.
 * Ajoute ici chaque nouvel écran au fur et à mesure de la conversion des maquettes.
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
  CandidateTabs: undefined;
  DetailOffre: { jobId?: string; title?: string; company?: string } | undefined;
  CandidatureRapide: { jobId?: string; title?: string; company?: string } | undefined;
  CandidatureEnvoyee: { company?: string } | undefined;
  SuiviCandidatures: undefined;
  CreationProfilCandidat: undefined;
  ProfilPublicCandidat: undefined;
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
  CreerAlerteEmploi: { alertId?: string; title?: string } | undefined;
  ComparaisonSalaires: undefined;
  CoachingCarriereIA: undefined;
  ConseilsCarriere: undefined;
  TestDeCompetences: undefined;
  PortfolioProjets: undefined;
  ReseauProfessionnel: undefined;
  AvisCultureEntreprise: { company?: string } | undefined;
  Parrainage: undefined;
  DiscussionCandidat: { company?: string } | undefined;
  DetailsCandidature: { title?: string; company?: string } | undefined;
  MentionsLegales: undefined;
  CentreAssistance: undefined;
  SupportPrioritaire: undefined;
  PageErreur: { type?: 'maintenance' | 'error' | 'offline' } | undefined;
  DetailsAlerteEmploi: { title?: string; location?: string } | undefined;
  MonCVDocuments: undefined;
  ResultatsCertification: { testName?: string; score?: number } | undefined;
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
  RecruiterTabs: undefined;
  PublierOffre: undefined;
  DetailsCandidat: { name?: string; role?: string; matchScore?: number } | undefined;
  PlanifierEntretien: { candidateName?: string; role?: string } | undefined;
  ComparaisonCandidats: undefined;
  VerificationKycEntreprise: undefined;
  GestionEntretiensVideo: undefined;
  VideoconferenceEntretien: { name?: string; role?: string; asRecruiter?: boolean } | undefined;
  NotesEntretien: { candidateName?: string; role?: string } | undefined;
  RedactionRapportEntretien: { candidateName?: string; role?: string } | undefined;
  ValidationRapportRH: { candidateName?: string; role?: string } | undefined;
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
  ValidationPaiementUSSD: undefined;
  PaiementReussi: undefined;
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
  DeclarationEmbauche: { candidateName?: string; role?: string } | undefined;
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
  CiblageCampagnePush: { campaignName?: string } | undefined;
  ConfirmationEnvoiCampagne: { campaignName?: string } | undefined;
  SuiviPerformancesCampagne: { campaignName?: string } | undefined;
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