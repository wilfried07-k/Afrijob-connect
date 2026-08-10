import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

/**
 * Destination : src/screens/recruiter/AttestationCNPSScreen.tsx
 *
 * Attestation de non-redevance CNPS de l'entreprise — statut de conformité
 * des cotisations, condition d'obtention de marchés publics et de la
 * publication d'offres sur la plateforme (badge "Entreprise Vérifiée").
 */

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
};

const HISTORY = [
  { id: '1', period: 'Juin 2026', status: 'À jour', paidOn: '05 Juil 2026' },
  { id: '2', period: 'Mai 2026', status: 'À jour', paidOn: '03 Juin 2026' },
  { id: '3', period: 'Avril 2026', status: 'À jour', paidOn: '02 Mai 2026' },
];

export default function AttestationCNPSScreen({ navigation }: Props) {
  const isCompliant = true;

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Attestation CNPS</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Compliance status */}
        <View
          className={`items-center gap-md rounded-2xl p-lg shadow-lg ${isCompliant ? 'bg-secondary' : 'bg-error'}`}
        >
          <MaterialIcons name={isCompliant ? 'verified-user' : 'gpp-bad'} size={44} color="#ffffff" />
          <Text className="text-center font-sans-bold text-headline-md text-white">
            {isCompliant ? 'Entreprise à jour de ses cotisations' : 'Cotisations en retard'}
          </Text>
          <Text className="text-center font-sans text-body-md text-white/90">
            {isCompliant
              ? "Votre attestation de non-redevance est valide jusqu'au 30 Septembre 2026."
              : 'Régularisez votre situation pour conserver votre badge Entreprise Vérifiée.'}
          </Text>
        </View>

        {/* Company info */}
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-lg text-on-surface-variant">Raison sociale</Text>
            <Text className="font-sans-semibold text-label-lg text-on-surface">TechCamer Solutions SARL</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-lg text-on-surface-variant">Matricule employeur</Text>
            <Text className="font-sans-semibold text-label-lg text-on-surface">E-DLA-042817</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-lg text-on-surface-variant">Salariés déclarés</Text>
            <Text className="font-sans-semibold text-label-lg text-on-surface">12</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-sans text-label-lg text-on-surface-variant">Dernier versement</Text>
            <Text className="font-sans-semibold text-label-lg text-secondary">05 Juillet 2026</Text>
          </View>
        </View>

        {/* Payment history */}
        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Historique des versements</Text>
          <View className="gap-2">
            {HISTORY.map((h) => (
              <View key={h.id} className="flex-row items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="flex-row items-center gap-md">
                  <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                  <View>
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{h.period}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">Payé le {h.paidOn}</Text>
                  </View>
                </View>
                <Text className="text-[10px] font-sans-bold uppercase tracking-wider text-secondary">{h.status}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row gap-md">
          <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-primary">
            <MaterialIcons name="download" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Télécharger l'attestation</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('PaiementCotisationsCNPS')}
            className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-sm"
          >
            <MaterialIcons name="payments" size={18} color="#ffffff" />
            <Text className="font-sans-semibold text-label-lg text-on-primary">Payer ce mois</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
