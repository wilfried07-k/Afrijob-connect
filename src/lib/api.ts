// On a physical device, `localhost` refers to the device itself. Configure the
// development API endpoint with EXPO_PUBLIC_API_BASE_URL in `.env.local`.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    const errorMessage = (data as ApiErrorResponse).detail || (data as ApiErrorResponse).message || 'Erreur rÃ©seau';
    throw new Error(errorMessage);
  }

  return data as T;
}

export type AccountType = 'candidate' | 'recruiter';
export type LoginAccountType = AccountType | 'admin';

export interface LoginPayload {
  email: string;
  password: string;
  account_type: LoginAccountType;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  account_type: AccountType;
  referral_code?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
  account_type: AccountType | 'admin';
  user_id: number;
}

export interface ProfileInfo {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  account_type: 'candidate' | 'recruiter' | 'admin';
  candidate_profile_id?: number;
  company_id?: number;
  company_name?: string;
  job_title?: string;
  city?: string;
  summary?: string;
  skills?: string;
  years_experience?: number;
}

export interface CandidateProfileUpdatePayload {
  user_id: number;
  full_name?: string;
  job_title?: string;
  city?: string;
  summary?: string;
  skills?: string;
  years_experience?: number;
}

export interface CandidateProfile {
  id: number;
  user_id: number;
  job_title?: string;
  city?: string;
  summary?: string;
  skills?: string;
  years_experience?: number;
  cnps_matricule?: string;
}

export interface JobOffer {
  id: number;
  company_id: number;
  title: string;
  description: string;
  requirements: string;
  city?: string;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  status: string;
  created_at: string;
  company_name?: string;
  company_description?: string;
  company_kyc_verified?: boolean;
}

export interface FavoriteJob {
  job_offer_id: number;
  title: string;
  company_name?: string;
  city?: string;
  salary_min?: number;
  salary_max?: number;
  saved_at?: string;
}

export interface ApplicationDetail {
  id: number;
  job_offer_id: number;
  job_title: string;
  company_name?: string;
  company_id?: number;
  status: string;
  match_score?: number;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface ConversationSummary {
  conversation_id: number;
  company_name?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

export interface MessageItem {
  id: number;
  conversation_id: number;
  sender_user_id: number;
  text: string;
  read: boolean;
  created_at: string;
}

export type CampaignSegment = 'candidates' | 'recruiters' | 'all' | 'premium';
export type CampaignChannel = 'SMS' | 'Email' | 'Push';
export interface MarketingCampaign {
  id: number;
  created_by_user_id: number;
  name: string;
  channel: CampaignChannel;
  content: string;
  audience_segment: CampaignSegment;
  audience_size: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingSummary {
  candidate_accounts: number;
  recruiter_accounts: number;
  campaigns_total: number;
  campaigns_prepared: number;
}

export async function getMarketingSummary(): Promise<MarketingSummary> {
  return request<MarketingSummary>('/admin/campaigns-summary', 'GET');
}
export async function listMarketingCampaigns(): Promise<MarketingCampaign[]> {
  return request<MarketingCampaign[]>('/admin/campaigns', 'GET');
}

export async function createMarketingCampaign(payload: Pick<MarketingCampaign, 'name' | 'channel' | 'content' | 'audience_segment'>): Promise<MarketingCampaign> {
  return request<MarketingCampaign>('/admin/campaigns', 'POST', payload);
}

export async function updateMarketingCampaignTarget(campaignId: number, payload: Pick<MarketingCampaign, 'name' | 'channel' | 'content' | 'audience_segment'> & { prepared: boolean }): Promise<MarketingCampaign> {
  return request<MarketingCampaign>(`/admin/campaigns/${campaignId}`, 'PATCH', payload);
}

export async function getMarketingCampaign(campaignId: number): Promise<MarketingCampaign> {
  return request<MarketingCampaign>(`/admin/campaigns/${campaignId}`, 'GET');
}
export interface BillingPayment {
  id: number;
  user_id: number;
  company_id: number;
  plan: string;
  amount_xaf: number;
  payment_method: string;
  external_reference?: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
}

export interface BillingSubscription {
  id: number;
  company_id: number;
  plan: string;
  starts_at: string;
  expires_at: string;
  status: string;
}

export async function getMyBillingSubscription(): Promise<BillingSubscription | null> {
  return request<BillingSubscription | null>('/billing/subscription/me', 'GET');
}
export async function createBillingPayment(payment_method: 'MTN Mobile Money' | 'Orange Money'): Promise<BillingPayment> {
  return request<BillingPayment>('/billing/payments', 'POST', { plan: 'Premium', payment_method });
}

export async function submitBillingPaymentReference(paymentId: number, external_reference: string): Promise<BillingPayment> {
  return request<BillingPayment>(`/billing/payments/${paymentId}/reference`, 'PATCH', { external_reference });
}

export async function listMyBillingPayments(): Promise<BillingPayment[]> {
  return request<BillingPayment[]>('/billing/payments/me', 'GET');
}

export async function listAdminBillingPayments(status: string = 'Toutes'): Promise<BillingPayment[]> {
  return request<BillingPayment[]>(`/admin/billing/payments?status=${encodeURIComponent(status)}`, 'GET');
}

export async function reviewBillingPayment(paymentId: number, status: 'Payé' | 'Rejeté'): Promise<BillingPayment> {
  return request<BillingPayment>(`/admin/billing/payments/${paymentId}`, 'PATCH', { status });
}
export async function changePassword(current_password: string, new_password: string): Promise<{ updated: boolean }> {
  return request<{ updated: boolean }>('/auth/password/change', 'POST', { current_password, new_password });
}
export async function login(payload: LoginPayload): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/login', 'POST', payload);
}

export async function register(payload: RegisterPayload): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/register', 'POST', payload);
}

export async function getMyProfile(userId: number): Promise<ProfileInfo> {
  return request<ProfileInfo>(`/profile/me/${userId}`, 'GET');
}

export async function getJobs(params?: {
  keyword?: string;
  city?: string;
  contract_type?: string | string[];
  sector?: string;
  minimum_salary?: number;
  status?: string;
}): Promise<JobOffer[]> {
  const query = new URLSearchParams();
  if (params?.keyword) query.set('keyword', params.keyword);
  if (params?.city) query.set('city', params.city);
  if (Array.isArray(params?.contract_type)) {
    params.contract_type.forEach((type) => query.append('contract_type', type));
  } else if (params?.contract_type) {
    query.set('contract_type', params.contract_type);
  }
  if (params?.sector) query.set('sector', params.sector);
  if (params?.minimum_salary) query.set('minimum_salary', String(params.minimum_salary));
  if (params?.status) query.set('status', params.status);
  const path = '/jobs' + (query.toString() ? '?' + query.toString() : '');
  return request<JobOffer[]>(path, 'GET');
}

export async function getJob(jobId: number): Promise<JobOffer> {
  return request<JobOffer>(`/jobs/${jobId}`, 'GET');
}

export async function listFavorites(candidateProfileId: number): Promise<FavoriteJob[]> {
  return request<FavoriteJob[]>(`/favorites/${candidateProfileId}`, 'GET');
}

export async function saveFavorite(candidateProfileId: number, jobOfferId: number): Promise<FavoriteJob> {
  return request<FavoriteJob>(`/favorites/${candidateProfileId}/${jobOfferId}`, 'POST');
}

export async function removeFavorite(candidateProfileId: number, jobOfferId: number): Promise<{ removed: boolean }> {
  return request<{ removed: boolean }>(`/favorites/${candidateProfileId}/${jobOfferId}`, 'DELETE');
}

export async function listCandidateApplications(candidateProfileId: number): Promise<ApplicationDetail[]> {
  return request<ApplicationDetail[]>(`/applications/candidate/${candidateProfileId}`, 'GET');
}

export async function applyToJob(payload: {
  candidate_id: number;
  job_offer_id: number;
  motivation_message?: string;
}): Promise<ApplicationDetail> {
  return request<ApplicationDetail>('/applications', 'POST', payload);
}

export interface JobApplicationCandidate {
  application_id: number;
  candidate_id: number;
  full_name?: string;
  job_title?: string;
  status: string;
  match_score?: number;
  job_offer_id: number;
}

export async function listJobApplications(jobOfferId: number): Promise<JobApplicationCandidate[]> {
  return request<JobApplicationCandidate[]>(`/applications/job/${jobOfferId}`, 'GET');
}

export async function updateApplicationStatus(applicationId: number, status: string): Promise<void> {
  await request<unknown>('/applications/' + applicationId + '/status', 'PATCH', { status });
}
export interface CreateJobPayload {
  company_id: number;
  title: string;
  description: string;
  requirements: string;
  city?: string;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
}

export interface UpdateJobPayload {
  title?: string;
  description?: string;
  requirements?: string;
  city?: string;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  status?: string;
}

export async function createJob(payload: CreateJobPayload): Promise<JobOffer> {
  return request<JobOffer>('/jobs', 'POST', payload);
}

export async function listCompanyJobs(companyId: number): Promise<JobOffer[]> {
  return request<JobOffer[]>(`/jobs/company/${companyId}`, 'GET');
}

export async function updateJob(jobId: number, payload: UpdateJobPayload): Promise<JobOffer> {
  return request<JobOffer>(`/jobs/${jobId}`, 'PATCH', payload);
}

export async function deleteJob(jobId: number): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(`/jobs/${jobId}`, 'DELETE');
}

export interface AdminReport {
  id: number;
  job_offer_id?: number;
  reported_user_id?: number;
  reported_by_user_id: number;
  reason: string;
  status: string;
  created_at: string;
  job_title?: string;
  company_name?: string;
  reporter_name?: string;
  reported_user_name?: string;
}

export async function createReport(payload: { job_offer_id?: number; reported_user_id?: number; reason: string }): Promise<AdminReport> {
  return request<AdminReport>('/reports', 'POST', payload);
}
export interface BannedAccount {
  id: number;
  user_id: number;
  reason: string;
  definitive: boolean;
  banned_at: string;
  active: boolean;
}

export async function listAdminReports(status: string = 'En attente'): Promise<AdminReport[]> {
  return request<AdminReport[]>(`/admin/reports?status=${encodeURIComponent(status)}`, 'GET');
}

export async function resolveAdminReport(reportId: number, status: string, removeJob: boolean = false): Promise<{ updated: boolean }> {
  return request<{ updated: boolean }>(`/admin/reports/${reportId}`, 'PATCH', { status, remove_job: removeJob });
}

export async function listPendingKyc(): Promise<CompanyInfo[]> {
  return request<CompanyInfo[]>('/admin/kyc/pending', 'GET');
}

export async function reviewKycCompany(companyId: number, approve: boolean, notes?: string): Promise<{ company_id: number; kyc_verified: boolean; review_status: string }> {
  const query = new URLSearchParams({ approve: String(approve), ...(notes ? { notes } : {}) }).toString();
  return request<{ company_id: number; kyc_verified: boolean; review_status: string }>(`/admin/kyc/${companyId}?${query}`, 'PATCH');
}
export async function listBannedAccounts(): Promise<BannedAccount[]> {
  return request<BannedAccount[]>('/admin/banned', 'GET');
}

export async function unbanUser(userId: number): Promise<{ unbanned: boolean }> {
  return request<{ unbanned: boolean }>(`/admin/unban/${userId}`, 'PATCH');
}

export async function banUser(payload: { user_id: number; reason: string; definitive?: boolean }): Promise<BannedAccount> {
  return request<BannedAccount>('/admin/ban', 'POST', payload);
}

export interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  jobs: boolean;
  messages: boolean;
  applications: boolean;
  interviews: boolean;
  news: boolean;
  marketing: boolean;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return request<NotificationPreferences>('/notifications/preferences/me', 'GET');
}

export async function saveNotificationPreferences(preferences: NotificationPreferences): Promise<NotificationPreferences> {
  return request<NotificationPreferences>('/notifications/preferences/me', 'PUT', preferences);
}
export async function listNotifications(userId: number): Promise<NotificationItem[]> {
  return request<NotificationItem[]>(`/notifications/${userId}`, 'GET');
}

export async function markNotificationRead(notificationId: number): Promise<NotificationItem> {
  return request<NotificationItem>(`/notifications/${notificationId}/read`, 'PATCH');
}

export async function markAllNotificationsRead(userId: number): Promise<{ updated: number }> {
  return request<{ updated: number }>(`/notifications/user/${userId}/read-all`, 'PATCH');
}

export async function upsertCandidateProfile(payload: CandidateProfileUpdatePayload): Promise<ProfileInfo> {
  return request<ProfileInfo>('/profile/candidate', 'PUT', payload);
}

export interface CompanyInfo {
  id: number;
  owner_user_id: number;
  name: string;
  sector?: string;
  description?: string;
  cnps_employer_matricule?: string;
  kyc_verified: boolean;
  review_status?: string;
  review_notes?: string;
}
export interface CandidateProfilePublic {
  id: number;
  full_name?: string;
  email?: string;
  job_title?: string;
  city?: string;
  summary?: string;
  skills: string[];
  years_experience?: number;
  assessments?: { id: number; test_name: string; score: number; total_questions: number; percentage: number; badge: string; created_at: string }[];
  projects?: { id: number; title: string; description: string; skills: string[]; url?: string | null; created_at: string }[];
}

export interface InterviewSummary {
  interview_id: number;
  application_id: number;
  job_title?: string;
  company_name?: string;
  candidate_name?: string;
  scheduled_at: string;
  mode: string;
  location_or_link?: string;
  status: string;
  report_status?: string | null;
}

export interface JobAlertItem {
  id: number;
  candidate_id: number;
  title: string;
  city?: string;
  frequency: string;
  active: boolean;
  created_at: string;
}

export async function getCandidateProfile(candidateId: number): Promise<CandidateProfilePublic> {
  return request<CandidateProfilePublic>(`/profile/candidate/${candidateId}`, 'GET');
}

export interface CompanyUpsertPayload {
  owner_user_id: number;
  name: string;
  sector?: string;
  description?: string;
  cnps_employer_matricule?: string;
}

export async function upsertCompany(payload: CompanyUpsertPayload): Promise<CompanyInfo> {
  return request<CompanyInfo>('/profile/company', 'PUT', payload);
}

export async function getCompany(companyId: number): Promise<CompanyInfo> {
  return request<CompanyInfo>(`/profile/company/${companyId}`, 'GET');
}

export async function listCandidateInterviews(candidateProfileId: number): Promise<InterviewSummary[]> {
  return request<InterviewSummary[]>(`/interviews/candidate/${candidateProfileId}`, 'GET');
}

export async function listCompanyInterviews(companyId: number): Promise<InterviewSummary[]> {
  return request<InterviewSummary[]>(`/interviews/company/${companyId}`, 'GET');
}

export async function updateInterviewStatus(interviewId: number, status: string): Promise<ScheduledInterview> {
  return request<ScheduledInterview>('/interviews/' + interviewId, 'PATCH', { status });
}

export interface SupportTicketItem {
  id: number;
  user_id: number;
  category: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
}

export async function createSupportTicket(payload: { category: string; subject: string; body: string }): Promise<SupportTicketItem> {
  return request<SupportTicketItem>('/support/tickets', 'POST', payload);
}

export async function listMySupportTickets(): Promise<SupportTicketItem[]> {
  return request<SupportTicketItem[]>('/support/tickets/me', 'GET');
}

export async function submitProductFeedback(payload: { applications_rating: number; usability_rating: number; value_rating: number; comment?: string }): Promise<{ id: number; created_at: string }> {
  return request<{ id: number; created_at: string }>('/feedback', 'POST', payload);
}
export interface DipeDeclarationItem {
  id: number;
  declaration_id: string;
  candidate_id: number;
  candidate_name?: string;
  contract_type: string;
  start_date: string;
  gross_salary: number;
  risk_rate_percent: number;
  status: string;
  created_at: string;
  message?: string;
}

export async function createDipeDeclaration(payload: {
  candidate_id: number;
  company_id: number;
  contract_type: string;
  start_date: string;
  gross_salary: number;
  risk_rate_percent: number;
  existing_matricule?: string;
  candidate_cni?: string;
}): Promise<DipeDeclarationItem> {
  return request<DipeDeclarationItem>('/cnps/declarations/dipe', 'POST', payload);
}

export async function listDipeDeclarations(companyId: number): Promise<DipeDeclarationItem[]> {
  return request<DipeDeclarationItem[]>(`/cnps/declarations/company/${companyId}`, 'GET');
}
export interface ScheduledInterview {
  id: number;
  application_id: number;
  scheduled_at: string;
  mode: string;
  location_or_link?: string;
  status: string;
}
export async function scheduleInterview(payload: {
  application_id: number;
  scheduled_at: string;
  mode?: string;
  location_or_link?: string;
}): Promise<ScheduledInterview> {
  return request<ScheduledInterview>('/interviews', 'POST', payload);
}

export async function createAlert(payload: {
  candidate_id: number;
  title: string;
  city?: string;
  frequency?: string;
}): Promise<JobAlertItem> {
  return request<JobAlertItem>('/alerts', 'POST', payload);
}

export async function listAlerts(candidateId: number): Promise<JobAlertItem[]> {
  return request<JobAlertItem[]>(`/alerts/${candidateId}`, 'GET');
}

export async function updateAlert(alertId: number, payload: {
  title?: string;
  city?: string;
  frequency?: string;
  active?: boolean;
}): Promise<JobAlertItem> {
  return request<JobAlertItem>(`/alerts/${alertId}`, 'PATCH', payload);
}

export async function deleteAlert(alertId: number): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(`/alerts/${alertId}`, 'DELETE');
}

export async function getAlertMatches(alertId: number): Promise<JobOffer[]> {
  return request<JobOffer[]>(`/alerts/${alertId}/matches`, 'GET');
}

export async function withdrawApplication(applicationId: number): Promise<{ withdrawn: boolean }> {
  return request<{ withdrawn: boolean }>('/applications/' + applicationId, 'DELETE');
}

export async function startConversation(candidateId: number, companyId: number): Promise<{ id: number; candidate_id: number; company_id: number }> {
  return request<{ id: number; candidate_id: number; company_id: number }>('/messages/conversations', 'POST', { candidate_id: candidateId, company_id: companyId });
}
export async function listCandidateConversations(candidateProfileId: number): Promise<ConversationSummary[]> {
  return request<ConversationSummary[]>(`/messages/conversations/candidate/${candidateProfileId}`, 'GET');
}

export async function getConversationMessages(conversationId: number): Promise<MessageItem[]> {
  return request<MessageItem[]>(`/messages/${conversationId}`, 'GET');
}

export async function sendMessage(conversationId: number, payload: { sender_user_id: number; text: string }): Promise<MessageItem> {
  return request<MessageItem>(`/messages/${conversationId}`, 'POST', payload);
}

export interface CompanyReview {
  id: number;
  rating: number;
  role?: string;
  body: string;
  created_at: string;
}

export async function listCompanyReviews(companyId: number): Promise<CompanyReview[]> {
  return request<CompanyReview[]>('/reviews/company/' + companyId, 'GET');
}

export async function createCompanyReview(payload: { company_id: number; rating: number; role?: string; body: string }): Promise<CompanyReview> {
  return request<CompanyReview>('/reviews', 'POST', payload);
}
export interface CnpsAdminSummary {
  dipe_declarations_total: number;
  dipe_pending_transmission: number;
  companies_total: number;
  companies_verified: number;
}

export async function getCnpsAdminSummary(): Promise<CnpsAdminSummary> {
  return request<CnpsAdminSummary>('/cnps/admin/summary', 'GET');
}
export interface AdminDashboardSummary {
  users: number;
  open_jobs: number;
  pending_reports: number;
  pending_kyc: number;
  companies: number;
  verified_companies: number;
  active_bans: number;
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  return request<AdminDashboardSummary>('/admin/dashboard/summary', 'GET');
}
export interface CareerExperience {
  id: number;
  candidate_id: number;
  employer: string;
  job_title: string;
  start_date: string;
  end_date?: string | null;
  description?: string | null;
  created_at: string;
}

export async function listCareerExperiences(): Promise<CareerExperience[]> {
  return request<CareerExperience[]>('/career/me', 'GET');
}

export async function createCareerExperience(payload: {
  employer: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  description?: string;
}): Promise<CareerExperience> {
  return request<CareerExperience>('/career/me', 'POST', payload);
}

export async function deleteCareerExperience(experienceId: number): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>('/career/me/' + experienceId, 'DELETE');
}
export interface InterviewReport {
  id: number;
  interview_id: number;
  recruiter_user_id: number;
  notes?: string | null;
  positives?: string | null;
  concerns?: string | null;
  technical_rating?: number | null;
  communication_rating?: number | null;
  soft_skills_rating?: number | null;
  impressions?: string | null;
  recommendation?: 'hire' | 'further' | 'reject' | null;
  status: string;
  updated_at: string;
}

export async function getInterviewReport(interviewId: number): Promise<InterviewReport | null> {
  return request<InterviewReport | null>('/interviews/' + interviewId + '/report', 'GET');
}

export async function saveInterviewReport(interviewId: number, payload: Partial<Omit<InterviewReport, 'id' | 'interview_id' | 'recruiter_user_id' | 'updated_at'>>): Promise<InterviewReport> {
  return request<InterviewReport>('/interviews/' + interviewId + '/report', 'PUT', payload);
}
export interface SkillAssessmentQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export interface SkillAssessmentTest {
  id: string;
  name: string;
  questions: SkillAssessmentQuestion[];
}

export interface SkillAssessmentResult {
  id: number;
  candidate_id: number;
  test_id: string;
  test_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  badge: string;
  created_at: string;
}

export async function listSkillAssessmentTests(): Promise<SkillAssessmentTest[]> {
  return request<SkillAssessmentTest[]>('/assessments/tests', 'GET');
}

export async function listMySkillAssessments(): Promise<SkillAssessmentResult[]> {
  return request<SkillAssessmentResult[]>('/assessments/me', 'GET');
}

export async function getSkillAssessment(id: number): Promise<SkillAssessmentResult> {
  return request<SkillAssessmentResult>('/assessments/' + id, 'GET');
}

export async function submitSkillAssessment(payload: { test_id: string; answers: { question_id: string; selected_option: number }[] }): Promise<SkillAssessmentResult> {
  return request<SkillAssessmentResult>('/assessments/submit', 'POST', payload);
}
export interface CompanyDirectorProfile {
  id: number;
  company_id: number;
  full_name: string;
  title: string;
  professional_email?: string | null;
  phone?: string | null;
  identity_status: string;
  updated_at: string;
}

export async function getCompanyDirector(): Promise<CompanyDirectorProfile | null> {
  return request<CompanyDirectorProfile | null>('/profile/company/me/director', 'GET');
}

export async function saveCompanyDirector(payload: {
  full_name: string;
  title: string;
  professional_email?: string;
  phone?: string;
}): Promise<CompanyDirectorProfile> {
  return request<CompanyDirectorProfile>('/profile/company/me/director', 'PUT', payload);
}
export interface ReferralSummary {
  code: string;
  total_signups: number;
  signups: { account_type: string; created_at: string }[];
}

export async function getMyReferrals(): Promise<ReferralSummary> {
  return request<ReferralSummary>('/referrals/me', 'GET');
}
export interface CandidatePortfolioProject {
  id: number;
  candidate_id: number;
  title: string;
  description: string;
  skills?: string | null;
  url?: string | null;
  created_at: string;
}

export async function listMyPortfolioProjects(): Promise<CandidatePortfolioProject[]> {
  return request<CandidatePortfolioProject[]>('/portfolio/me', 'GET');
}

export async function createPortfolioProject(payload: { title: string; description: string; skills: string[]; url?: string }): Promise<CandidatePortfolioProject> {
  return request<CandidatePortfolioProject>('/portfolio/me', 'POST', payload);
}

export async function deletePortfolioProject(projectId: number): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>('/portfolio/me/' + projectId, 'DELETE');
}