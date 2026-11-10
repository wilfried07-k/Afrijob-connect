import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SelectField from '../../components/ui/SelectField';
import Button from '../../components/ui/Button';
import { colors } from '../../theme';

/**
 * Destination : src/screens/recruiter/PaiementCotisationsCNPSScreen.tsx
 *
 * Calcul et paiement des cotisations CNPS mensuelles de l'entreprise.
 * Taux réels (Cameroun 2026) :
 * - Prestations familiales (PF)   : 7%    — employeur uniquement
 * - Pension vieillesse (PVID)      : 4,2%  — 2,8% employeur + 1,4% salarié
 * - Accidents du travail (AT/MP)   : 1,75% à 5% selon secteur — employeur uniquement
 * - Plafond de cotisation          : 300 000 FCFA / salarié / mois
 *
 * Ces taux sont ceux en vigueur au moment de la rédaction ; à faire vérifier
 * par un comptable ou directement sur cnps.cm avant tout paiement réel,
 * les barèmes pouvant évoluer.
 */

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
};

const PF_RATE = 0.07;
const PVID_EMPLOYER_RATE = 0.028;
const PVID_EMPLOYEE_RATE = 0.014;
const SALARY_CAP = 300_000;

const RISK_CATEGORIES = [
  { label: 'Bureau / Services (1,75%)', value: '1.75' },
  { label: 'Commerce / Distribution (2,5%)', value: '2.5' },
  { label: 'Industrie légère (3,5%)', value: '3.5' },
  { label: 'BTP / Industrie lourde (5%)', value: '5' },
];

function formatFCFA(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n))} FCFA`;
}

export default function PaiementCotisationsCNPSScreen({ navigation }: Props) {
  const [employeeCount, setEmployeeCount] = useState('12');
  const [avgSalary, setAvgSalary] = useState('280000');
  const [riskCategory, setRiskCategory] = useState('1.75');

  const breakdown = useMemo(() => {
    const count = parseInt(employeeCount, 10) || 0;
    const salary = Math.min(parseInt(avgSalary, 10) || 0, SALARY_CAP);
    const atmpRate = parseFloat(riskCategory) / 100;

    const pfTotal = salary * PF_RATE * count;
    const pvidEmployerTotal = salary * PVID_EMPLOYER_RATE * count;
    const pvidEmployeeTotal = salary * PVID_EMPLOYEE_RATE * count;
    const atmpTotal = salary * atmpRate * count;

    const employerTotal = pfTotal + pvidEmployerTotal + atmpTotal;
    const employeeTotal = pvidEmployeeTotal;
    const grandTotal = employerTotal + employeeTotal;

    return { pfTotal, pvidEmployerTotal, pvidEmployeeTotal, atmpTotal, employerTotal, employeeTotal, grandTotal, cappedSalary: salary };
  }, [employeeCount, avgSalary, riskCategory]);

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Cotisations CNPS</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Inputs */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Votre masse salariale</Text>
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Nombre de salariés déclarés</Text>
            <TextInput
              value={employeeCount}
              onChangeText={setEmployeeCount}
              keyboardType="numeric"
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
          </View>
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Salaire brut moyen (FCFA)</Text>
            <TextInput
              value={avgSalary}
              onChangeText={setAvgSalary}
              keyboardType="numeric"
              className="h-12 rounded-lg border border-outline px-md font-sans text-body-md text-on-surface"
            />
            <Text className="font-sans text-label-md text-on-surface-variant">
              Plafonné à {formatFCFA(SALARY_CAP)} par salarié pour le calcul CNPS.
            </Text>
          </View>
          <View className="gap-1">
            <Text className="font-sans-medium text-label-lg text-on-surface-variant">Catégorie de risque (AT/MP)</Text>
            <SelectField placeholder="Catégorie de risque" options={RISK_CATEGORIES} value={riskCategory} onChange={setRiskCategory} />
          </View>
        </View>

        {/* Breakdown */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Détail par branche (mensuel)</Text>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-sans-medium text-label-lg text-on-surface">Prestations familiales</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">7% — employeur</Text>
            </View>
            <Text className="font-sans-bold text-label-lg text-on-surface">{formatFCFA(breakdown.pfTotal)}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-sans-medium text-label-lg text-on-surface">Pension (PVID) — part employeur</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">2,8%</Text>
            </View>
            <Text className="font-sans-bold text-label-lg text-on-surface">{formatFCFA(breakdown.pvidEmployerTotal)}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-sans-medium text-label-lg text-on-surface">Pension (PVID) — part salarié</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">1,4% (retenue sur salaire)</Text>
            </View>
            <Text className="font-sans-bold text-label-lg text-on-surface">{formatFCFA(breakdown.pvidEmployeeTotal)}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-sans-medium text-label-lg text-on-surface">Accidents du travail</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{riskCategory}% — employeur</Text>
            </View>
            <Text className="font-sans-bold text-label-lg text-on-surface">{formatFCFA(breakdown.atmpTotal)}</Text>
          </View>

          <View className="h-[1px] bg-outline-variant/30" />

          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Part employeur totale</Text>
            <Text className="font-sans-bold text-title-lg text-primary">{formatFCFA(breakdown.employerTotal)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-label-lg text-on-surface-variant">Part salariés (retenue à la source)</Text>
            <Text className="font-sans-bold text-title-lg text-on-surface">{formatFCFA(breakdown.employeeTotal)}</Text>
          </View>
        </View>

        {/* Total */}
        <View className="gap-2 rounded-xl bg-primary p-lg shadow-lg">
          <Text className="font-sans text-label-lg text-white/80">Total à verser à la CNPS ce mois</Text>
          <Text className="font-sans-extrabold text-display-lg text-white">{formatFCFA(breakdown.grandTotal)}</Text>
          <Text className="font-sans text-label-md text-white/70">
            Pour {employeeCount || 0} salarié(s) à {formatFCFA(breakdown.cappedSalary)} brut plafonné.
          </Text>
        </View>

        <Button
          label="Procéder au paiement"
          onPress={() => navigation.navigate('SelectionModePaiement')}
        />

        <View className="flex-row items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-md">
          <MaterialIcons name="info" size={18} color={colors.onSurfaceVariant} />
          <Text className="flex-1 font-sans text-label-md text-on-surface-variant">
            Barèmes indicatifs — vérifiez les taux en vigueur sur cnps.cm ou auprès d'un comptable
            avant tout versement réel. Le paiement peut se faire en agence, via banque partenaire, ou
            par Mobile Money / Orange Money.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
