import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

/**
 * Destination : src/screens/candidate/ReleveCarriereScreen.tsx
 *
 * Relevé de carrière CNPS du candidat : matricule assuré social, historique
 * des employeurs et périodes cotisées, mois validés vers la pension (seuil
 * légal : 180 mois), estimation de pension.
 *
 * Données réelles utilisées (CNPS Cameroun 2026) :
 * - Pension = 30% du Salaire Moyen Cotisable (36 derniers mois) pour 180 mois,
 *   +1% par tranche de 12 mois supplémentaires, plafonné à 80% du SMC.
 * - Retraite à 60 ans (55 ans pour métiers pénibles).
 * Toutes les données de carrière ci-dessous sont des exemples statiques —
 * à remplacer par un appel à l'API CNPS / au backend de l'app.
 */

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
};

const MONTHS_REQUIRED = 180;
const MONTHS_VALIDATED = 96; // exemple : 8 ans cotisés

type EmployerPeriod = {
  id: string;
  employer: string;
  matriculeEmployeur: string;
  startDate: string;
  endDate: string | 'En cours';
  status: 'ok' | 'litige';
};

const HISTORY: EmployerPeriod[] = [
  {
    id: '1',
    employer: 'MTN Cameroon',
    matriculeEmployeur: 'E-DLA-042817',
    startDate: 'Sept. 2022',
    endDate: 'En cours',
    status: 'ok',
  },
  {
    id: '2',
    employer: 'Cameroon Soft Hub SARL',
    matriculeEmployeur: 'E-YAO-118204',
    startDate: 'Jan. 2019',
    endDate: 'Août 2022',
    status: 'ok',
  },
  {
    id: '3',
    employer: 'Digital Corp S.A.',
    matriculeEmployeur: 'E-DLA-093456',
    startDate: 'Mars 2018',
    endDate: 'Déc. 2018',
    status: 'litige',
  },
];

export default function ReleveCarriereScreen({ navigation }: Props) {
  const progressPercent = Math.min(100, Math.round((MONTHS_VALIDATED / MONTHS_REQUIRED) * 100));
  const monthsRemaining = Math.max(0, MONTHS_REQUIRED - MONTHS_VALIDATED);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Relevé de Carrière CNPS</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Matricule assuré */}
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="badge" size={20} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg uppercase tracking-wider text-primary">
              Numéro d'Assuré Social
            </Text>
          </View>
          <Text className="font-sans-bold text-headline-lg text-on-surface">1 09 88 04123 45</Text>
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="check-circle" size={14} color={colors.secondary} />
            <Text className="font-sans text-label-md text-secondary">Immatriculation vérifiée</Text>
          </View>
        </View>

        {/* Progression vers la pension */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Droits à pension</Text>
            <Text className="font-sans-bold text-label-lg text-primary">{MONTHS_VALIDATED} / {MONTHS_REQUIRED} mois</Text>
          </View>
          <View className="h-3 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <View className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
          </View>
          <Text className="font-sans text-body-md text-on-surface-variant">
            {monthsRemaining > 0
              ? `Il vous reste ${monthsRemaining} mois de cotisation pour atteindre le seuil légal de pension (180 mois / 15 ans).`
              : 'Vous avez atteint le seuil légal minimum pour une pension de retraite.'}
          </Text>
        </View>

        {/* Estimation pension */}
        <View className="gap-2 rounded-xl bg-primary p-lg shadow-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="elderly" size={20} color="#ffffff" />
            <Text className="font-sans-semibold text-label-lg text-white/80">Estimation de pension</Text>
          </View>
          <Text className="font-sans-extrabold text-display-lg text-white">142 500 FCFA / mois</Text>
          <Text className="font-sans text-body-md text-white/85">
            Basée sur 30% de votre Salaire Moyen Cotisable (36 derniers mois) au seuil de 180 mois.
            Chaque année cotisée en plus ajoute 1% supplémentaire, jusqu'à 80% du SMC.
          </Text>
        </View>

        {/* Historique employeurs */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Historique des employeurs</Text>
          <View className="gap-2">
            {HISTORY.map((period) => (
              <View
                key={period.id}
                className={`gap-2 rounded-xl border p-md shadow-sm ${
                  period.status === 'litige'
                    ? 'border-error/30 bg-error-container/5'
                    : 'border-outline-variant/30 bg-surface-container-lowest'
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{period.employer}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">
                      Matricule employeur : {period.matriculeEmployeur}
                    </Text>
                  </View>
                  {period.status === 'litige' && (
                    <View className="rounded-full bg-error px-2 py-0.5">
                      <Text className="text-[10px] font-sans-bold text-white">À vérifier</Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="calendar-month" size={14} color={colors.onSurfaceVariant} />
                  <Text className="font-sans text-label-md text-on-surface-variant">
                    {period.startDate} — {period.endDate}
                  </Text>
                </View>
                {period.status === 'litige' && (
                  <Pressable className="mt-1 flex-row items-center gap-1 self-start">
                    <MaterialIcons name="report-problem" size={14} color={colors.error} />
                    <Text className="font-sans-semibold text-label-md text-error">
                      Signaler une anomalie de cotisation
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className="gap-md">
          <Pressable className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-primary">
            <MaterialIcons name="download" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Télécharger le relevé (PDF)</Text>
          </Pressable>
          <View className="flex-row items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-md">
            <MaterialIcons name="info" size={18} color={colors.onSurfaceVariant} />
            <Text className="flex-1 font-sans text-label-md text-on-surface-variant">
              Ce relevé est synchronisé avec votre compte MyCNPS. En cas d'écart avec vos bulletins de
              salaire, contactez le centre de prévoyance sociale le plus proche.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
