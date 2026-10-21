import { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/ui/Screen';
import { colors } from '../../theme';
import { CandidateStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { listCandidateApplications, listFavorites } from '../../lib/api';

type MenuItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Compte',
    items: [
      { icon: 'person', label: 'Informations personnelles' },
      { icon: 'work', label: 'PrÃ©fÃ©rences de recherche' },
      { icon: 'description', label: 'Mes candidatures' },
      { icon: 'event', label: 'Mon agenda' },
      { icon: 'description', label: 'Mon CV' },
      { icon: 'folder', label: 'Mon CV & Documents' },
      { icon: 'tune', label: 'Centre de prÃ©fÃ©rences' },
      { icon: 'bar-chart', label: 'Comparer les salaires' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: 'notifications-active', label: 'Alertes emploi' },
      { icon: 'mail', label: 'Messages' },
      { icon: 'tune', label: 'PrÃ©fÃ©rences de notifications' },
    ],
  },
  {
    title: 'CarriÃ¨re',
    items: [
      { icon: 'smart-toy', label: 'Coach CarriÃ¨re IA' },
      { icon: 'auto-fix-high', label: 'RÃ©daction assistÃ©e par IA' },
      { icon: 'article', label: 'Conseils CarriÃ¨re' },
      { icon: 'quiz', label: 'Tests de CompÃ©tences' },
      { icon: 'collections-bookmark', label: 'Mon Portfolio' },
      { icon: 'groups', label: 'Mon RÃ©seau' },
      { icon: 'card-giftcard', label: 'Parrainage' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'settings', label: 'ParamÃ¨tres' },
      { icon: 'help-outline', label: "Centre d'assistance" },
      { icon: 'workspace-premium', label: 'Support Prioritaire' },
      { icon: 'description', label: 'Conditions & confidentialitÃ©' },
    ],
  },
];



export default function ProfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CandidateStackParamList>>();
  const { authState, signOut } = useAuth();
  const candidateId = authState.profile?.candidate_profile_id;
  const [applicationCount, setApplicationCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useFocusEffect(useCallback(() => {
    let active = true;
    const load = async () => {
      if (!candidateId) { setLoading(false); return; }
      setLoading(true);
      try {
        const [applications, favorites] = await Promise.all([listCandidateApplications(candidateId), listFavorites(candidateId)]);
        if (active) { setApplicationCount(applications.length); setFavoriteCount(favorites.length); }
      } catch { if (active) { setApplicationCount(0); setFavoriteCount(0); } }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [candidateId]));
  const fullName = authState.profile?.full_name || 'Mon profil';
  const initials = fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const stats = [{ label: 'Candidatures', value: String(applicationCount) }, { label: 'Favoris', value: String(favoriteCount) }];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Pressable
          onPress={() => navigation.navigate('ProfilPublicCandidat')}
          className="items-center gap-md px-container-margin pb-lg pt-lg"
        >
          <View className="relative">
            <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-primary-fixed bg-surface-container-low">
              <Text className="font-sans-bold text-headline-lg text-primary">{initials}</Text>
            </View>
            <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary">
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </View>
          </View>
          <View className="items-center">
            <Text className="font-sans-bold text-headline-lg text-on-surface">{fullName}</Text>
            <Text className="font-sans-semibold text-title-lg text-primary">{authState.profile?.job_title || 'Titre professionnel à renseigner'}</Text>
            <View className="mt-1 flex-row items-center gap-1">
              <MaterialIcons name="location-on" size={16} color={colors.onSurfaceVariant} />
              <Text className="font-sans text-label-lg text-on-surface-variant">{authState.profile?.city || 'Ville à renseigner'}</Text>
            </View>
            <View className="mt-2 flex-row items-center gap-1">
              <MaterialIcons name="visibility" size={14} color={colors.primary} />
              <Text className="font-sans-semibold text-label-md text-primary">Voir mon profil public</Text>
            </View>
          </View>
        </Pressable>

        {/* Action buttons */}
        <View className="flex-row gap-md px-container-margin pb-lg">
          <Pressable
            onPress={() => navigation.navigate('CreationProfilCandidat')}
            className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-primary-container"
          >
            <MaterialIcons name="edit" size={18} color={colors.onPrimaryContainer} />
            <Text className="font-sans-semibold text-label-lg text-on-primary-container">Modifier</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('CoffreFortDocuments')} className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-surface-container-high">
            <MaterialIcons name="folder" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Gérer mes documents</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="mb-lg flex-row justify-between rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-container-margin py-md shadow-sm">
          {stats.map((stat) => (
            <View key={stat.label} className="items-center">
              <Text className="font-sans-bold text-headline-md text-primary">{loading ? '…' : stat.value}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu groups */}
        <View className="gap-lg px-container-margin">
          {MENU_GROUPS.map((group) => (
            <View key={group.title} className="gap-sm">
              <Text className="px-1 font-sans-semibold text-label-lg uppercase tracking-wider text-primary">
                {group.title}
              </Text>
              <View className="overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
                {group.items.map((item, index) => (
                  <View key={item.label}>
                    <Pressable
                      className="flex-row items-center p-md"
                      onPress={() => {
                        switch (item.label) {
                          case 'Messages':
                            navigation.navigate('CandidateTabs', { screen: 'Messages' });
                            break;
                          case 'Mes candidatures':
                            navigation.navigate('SuiviCandidatures');
                            break;
                          case 'Mon agenda':
                            navigation.navigate('CalendrierCandidat');
                            break;
                          case 'Informations personnelles':
                            navigation.navigate('CreationProfilCandidat');
                            break;
                          case 'Mon CV':
                            navigation.navigate('MonCVDocuments');
                            break;
                          case 'Mon CV & Documents':
                            navigation.navigate('CoffreFortDocuments');
                            break;
                          case 'Comparer les salaires':
                            navigation.navigate('ComparaisonSalaires');
                            break;
                          case 'Alertes emploi':
                            navigation.navigate('GestionAlertesEmploi');
                            break;
                          case 'PrÃ©fÃ©rences de notifications':
                            navigation.navigate('ParametresNotifications');
                            break;
                          case 'ParamÃ¨tres':
                            navigation.navigate('ParametresCompte');
                            break;
                          case "Centre d'assistance":
                            navigation.navigate('CentreAssistance');
                            break;
                          case 'Support Prioritaire':
                            navigation.navigate('SupportPrioritaire');
                            break;
                          case 'Conditions & confidentialitÃ©':
                            navigation.navigate('MentionsLegales');
                            break;
                          case 'Coach CarriÃ¨re IA':
                            navigation.navigate('CoachingCarriereIA');
                            break;
                          case 'Conseils CarriÃ¨re':
                            navigation.navigate('ConseilsCarriere');
                            break;
                          case 'Tests de CompÃ©tences':
                            navigation.navigate('TestDeCompetences');
                            break;
                          case 'Mon Portfolio':
                            navigation.navigate('PortfolioProjets');
                            break;
                          case 'Mon RÃ©seau':
                            navigation.navigate('ReseauProfessionnel');
                            break;
                          case 'Parrainage':
                            navigation.navigate('Parrainage');
                            break;
                          case 'RÃ©daction assistÃ©e par IA':
                            navigation.navigate('RedactionAssisteeIA');
                            break;
                          case 'Centre de prÃ©fÃ©rences':
                            navigation.navigate('CentrePreferences');
                            break;
                        }
                      }}
                    >
                      <MaterialIcons name={item.icon} size={20} color={colors.onSurfaceVariant} />
                      <Text className="ml-md flex-1 font-sans text-body-lg text-on-surface">{item.label}</Text>
                      <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
                    </Pressable>
                    {index < group.items.length - 1 && (
                      <View className="mx-md h-[1px] bg-outline-variant/10" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <Pressable onPress={() => { signOut(); (navigation as any).getParent()?.getParent()?.reset({ index: 0, routes: [{ name: 'Auth' }] }); }} className="mt-md flex-row items-center justify-center gap-2 rounded-lg border border-error/30 py-md">
            <MaterialIcons name="logout" size={18} color={colors.error} />
            <Text className="font-sans-semibold text-label-lg text-error">DÃ©connexion</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
