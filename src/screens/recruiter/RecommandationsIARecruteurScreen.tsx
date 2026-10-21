import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { listCompanyJobs, listJobApplications } from '../../lib/api';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

type Recommendation = {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  reason: string;
  applicationId?: number;
  candidateId?: number;
};

export default function RecommandationsIARecruteurScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const companyId = authState.profile?.company_id;

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }
      try {
        const jobs = await listCompanyJobs(companyId);
        const allRecs: Recommendation[] = [];

        for (const job of jobs.slice(0, 3)) {
          try {
            const apps = await listJobApplications(job.id);
            for (const app of apps) {
              allRecs.push({
                id: String(app.application_id),
                applicationId: app.application_id,
                candidateId: app.candidate_id,
                name: app.full_name || 'Candidat qualifié',
                role: app.job_title || job.title,
                matchScore: Math.round(app.match_score ?? 85),
                reason: `Profil pertinent détecté par l'algorithme TF-IDF pour le poste "${job.title}".`,
              });
            }
          } catch {
            // ignore per job
          }
        }

        if (active) {
          // Sort by highest match score
          allRecs.sort((a, b) => b.matchScore - a.matchScore);
          setRecommendations(allRecs);
        }
      } catch {
        // fallback
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRecommendations();
    return () => {
      active = false;
    };
  }, [companyId]);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-container">
          <MaterialIcons name="psychology-alt" size={18} color={colors.onPrimaryContainer} />
        </View>
        <Text className="font-sans-bold text-headline-md text-primary">Recommandations IA</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-3 font-sans text-body-md text-on-surface-variant">
            Analyse des profils et calcul du matching...
          </Text>
        </View>
      ) : (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListHeaderComponent={
            <Text className="mb-2 font-sans text-body-md text-on-surface-variant">
              Basé sur vos offres actives et l’analyse sémantique, voici les candidats les plus alignés avec vos besoins.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('DetailsCandidat', {
                  applicationId: item.applicationId,
                  candidateId: item.candidateId,
                  name: item.name,
                  role: item.role,
                  matchScore: item.matchScore,
                })
              }
              className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm"
            >
              <View className="flex-row items-center gap-md">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Text className="font-sans-bold text-label-lg text-primary">{item.name[0]}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-title-lg text-on-surface">{item.name}</Text>
                  <Text className="font-sans text-label-lg text-on-surface-variant">{item.role}</Text>
                </View>
                <View className="flex-row items-center gap-1 rounded-full bg-secondary-container/30 px-3 py-1">
                  <MaterialIcons name="recommend" size={14} color={colors.onSecondaryContainer} />
                  <Text className="font-sans-bold text-label-md text-on-secondary-container">{item.matchScore}%</Text>
                </View>
              </View>
              <Text className="font-sans text-body-md text-on-surface-variant">{item.reason}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-xl">
              <MaterialIcons name="person-search" size={48} color={colors.outline} />
              <Text className="text-center font-sans-semibold text-title-md text-on-surface">
                Aucun profil recommandé pour l'instant
              </Text>
              <Text className="text-center font-sans text-body-md text-on-surface-variant">
                Publiez des offres d'emploi ou recevez des candidatures pour que l'IA puisse matcher les meilleurs profils.
              </Text>
              <Pressable
                onPress={() => navigation.navigate('PublierOffre')}
                className="mt-2 h-11 flex-row items-center justify-center gap-2 rounded-lg bg-primary px-lg"
              >
                <MaterialIcons name="add" size={18} color="#ffffff" />
                <Text className="font-sans-semibold text-label-lg text-white">Publier une offre</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}
