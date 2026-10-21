import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { RecruiterStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { getCompany, listCompanyJobs, type CompanyInfo, type JobOffer } from '../../lib/api';

type Tab = 'apropos' | 'offres';

export default function ProfilEntrepriseScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RecruiterStackParamList>>();
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;
  const [tab, setTab] = useState<Tab>('apropos');
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [companyJobs, setCompanyJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const loadCompany = async () => {
      if (!companyId) {
        setCompany(null);
        setCompanyJobs([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError('');
      try {
        const [details, jobs] = await Promise.all([
          getCompany(companyId),
          listCompanyJobs(companyId),
        ]);
        if (active) {
          setCompany(details);
          setCompanyJobs(jobs);
        }
      } catch (error) {
        if (active) setLoadError((error as Error).message || 'Impossible de charger le profil entreprise.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadCompany();
    return () => { active = false; };
  }, [companyId]);

  const activeJobCount = companyJobs.filter((job) => job.status.toLowerCase() === 'ouvert').length;
  const stats = [
    { label: 'Offres actives', value: String(activeJobCount) },
    { label: 'Offres au total', value: String(companyJobs.length) },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero banner */}
        <View className="h-40 w-full bg-primary/90" />

        {/* Logo + identity */}
        <View className="-mt-10 flex-row items-end gap-md px-container-margin">
          <View className="h-24 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-lg ring-4 ring-white">
            <MaterialIcons name="corporate-fare" size={40} color={colors.primary} />
          </View>
        </View>
        <View className="mt-2 px-container-margin">
          <View className="flex-row items-center gap-1">
            <Text className="font-sans-bold text-headline-lg text-on-surface">{company?.name ?? authState.profile?.company_name ?? 'Votre entreprise'}</Text>
            {company?.kyc_verified && <MaterialIcons name="verified" size={20} color={colors.primary} />}
          </View>
          <Text className="font-sans text-label-lg text-on-surface-variant">
            {company?.sector ?? 'Secteur non renseignÃ©'}
          </Text>
        </View>
        {/* Company profile actions */}
        <View className="mt-md flex-row gap-2 px-container-margin">
          <Pressable
            onPress={() => navigation.navigate('CreationProfilEntreprise')}
            className="h-12 flex-1 items-center justify-center rounded-md bg-primary shadow-sm"
          >
            <Text className="font-sans-semibold text-label-lg text-white">Modifier le profil</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ParametresCompte')}
            className="h-12 w-12 items-center justify-center rounded-md border border-outline"
          >
            <MaterialIcons name="settings" size={20} color={colors.primary} />
          </Pressable>
        </View>



        <Pressable
          onPress={() => navigation.navigate('FaqRecruteurs')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="help-outline" size={18} color={colors.primary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">FAQ Recruteurs</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ParrainageRecruteur')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="handshake" size={18} color={colors.secondary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Programme Partenaire</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('MentionsLegales')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="policy" size={18} color={colors.onSurfaceVariant} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Mentions lÃ©gales & CGU</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('DocumentsConformiteEntreprise')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="fact-check" size={18} color={colors.secondary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Documents de conformitÃ©</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ProfilDirigeantEntreprise')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="badge" size={18} color={colors.primary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Profil du dirigeant</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('GuideBonnesPratiques')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="menu-book" size={18} color={colors.tertiary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Guide de bonnes pratiques</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('FeedbackExperience')}
          className="mx-container-margin mt-2 flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="feedback" size={18} color={colors.primary} />
          </View>
          <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">Donner mon avis</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
        </Pressable>

        {/* Stats */}
        <View className="mt-lg flex-row gap-2 px-container-margin">
          {stats.map((stat) => (
            <View key={stat.label} className="flex-1 items-center rounded-lg border border-outline-variant/30 bg-surface-container-low p-md">
              <Text className="font-sans text-label-md text-on-surface-variant">{stat.label}</Text>
              <Text className="mt-1 font-sans-semibold text-title-lg text-primary">{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* KYC verification banner */}
        <Pressable
          onPress={() => navigation.navigate('VerificationKycEntreprise')}
          className="mx-container-margin mt-lg flex-row items-center gap-md rounded-xl border border-tertiary/20 bg-tertiary-fixed/20 p-md"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <MaterialIcons name="verified-user" size={20} color={colors.tertiary} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-label-lg text-on-surface">{company?.kyc_verified ? 'Entreprise vérifiée' : 'Vérification KYC à compléter'}</Text>
            <Text className="font-sans text-label-md text-on-surface-variant">
              {company?.kyc_verified ? 'Les informations de conformité de cette entreprise ont été vérifiées.' : 'Complétez les documents de conformité pour demander la vérification.'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.tertiary} />
        </Pressable>

        {/* Tabs */}
        <View className="mt-lg flex-row gap-lg border-b border-outline-variant px-container-margin">
          <Pressable onPress={() => setTab('apropos')} className={`pb-3 ${tab === 'apropos' ? 'border-b-2 border-primary' : ''}`}>
            <Text className={`font-sans-semibold text-label-lg ${tab === 'apropos' ? 'text-primary' : 'text-on-surface-variant'}`}>
              Ã€ propos
            </Text>
          </Pressable>
          <Pressable onPress={() => setTab('offres')} className={`pb-3 ${tab === 'offres' ? 'border-b-2 border-primary' : ''}`}>
            <Text className={`font-sans-semibold text-label-lg ${tab === 'offres' ? 'text-primary' : 'text-on-surface-variant'}`}>
              Offres d'emploi
            </Text>
          </Pressable>
        </View>

        {tab === 'apropos' ? (
          <View className="gap-lg px-container-margin py-lg">
            <View className="gap-md">
              <Text className="font-sans-semibold text-title-lg text-on-surface">Notre Mission</Text>
              <Text className="font-sans text-body-lg leading-relaxed text-on-surface-variant">
                {company?.description || 'Aucune description nâ€™a Ã©tÃ© renseignÃ©e pour cette entreprise.'}
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-md px-container-margin py-lg">
            {loading ? (<ActivityIndicator color={colors.primary} />) : loadError ? (<Text className="px-container-margin text-body-md text-error">{loadError}</Text>) : companyJobs.filter((job) => job.status.toLowerCase() === 'ouvert').length === 0 ? (<Text className="px-container-margin text-body-md text-on-surface-variant">Aucune offre ouverte pour le moment.</Text>) : companyJobs.filter((job) => job.status.toLowerCase() === 'ouvert').map((role) => (
              <Pressable
                key={role.id}
                onPress={() => navigation.navigate('RecruiterTabs', { screen: 'GestionDesOffres' })}
                className="flex-row items-center gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md"
              >
                <View className="h-12 w-12 items-center justify-center rounded-md bg-surface-container">
                  <MaterialIcons name="work-outline" size={20} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{role.title}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">
                    {role.city ?? 'Ville non prÃ©cisÃ©e'} Â· {role.contract_type ?? 'Contrat'}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
