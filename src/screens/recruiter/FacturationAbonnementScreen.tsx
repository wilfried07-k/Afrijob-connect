import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void } };

const INVOICES = [
  { id: 'INV-2026-014', date: '15 Juin 2026', amount: '45 000 FCFA', status: 'Payée' },
  { id: 'INV-2026-013', date: '15 Mai 2026', amount: '45 000 FCFA', status: 'Payée' },
  { id: 'INV-2026-012', date: '15 Avril 2026', amount: '45 000 FCFA', status: 'Payée' },
];

export default function FacturationAbonnementScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Facturation</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Active plan */}
        <View className="gap-md rounded-2xl bg-primary p-lg shadow-lg">
          <View className="flex-row items-center gap-2 self-start rounded-full bg-white/20 px-3 py-1">
            <View className="h-2 w-2 rounded-full bg-secondary-fixed" />
            <Text className="font-sans-medium text-label-md text-white">Compte Entreprise Actif</Text>
          </View>
          <Text className="font-sans-extrabold text-display-lg text-white">Plan Premium</Text>
          <Text className="font-sans text-body-lg text-white/90">
            Votre abonnement est actif jusqu'au 15 Juillet 2026. Profitez de toutes les fonctionnalités
            avancées et d'un support prioritaire.
          </Text>
          <View className="mt-md flex-row items-end justify-between">
            <View>
              <Text className="font-sans text-label-md uppercase tracking-wider text-white/70">
                Prochain prélèvement
              </Text>
              <Text className="font-sans-semibold text-title-lg text-white">45 000 FCFA / mois</Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('SelectionModePaiement')}
              className="rounded-xl bg-white px-lg py-3 shadow-sm"
            >
              <Text className="font-sans-semibold text-label-lg text-primary">Gérer</Text>
            </Pressable>
          </View>
        </View>

        {/* Payment method */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Méthode de paiement</Text>
          <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-low p-md">
            <View className="h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
              <MaterialIcons name="smartphone" size={20} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">Orange Money</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">••• 42 18</Text>
            </View>
            <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
          </View>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-primary py-3">
            <MaterialIcons name="add" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Modifier</Text>
          </Pressable>
        </View>

        {/* Billing history */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title-lg text-on-surface">Historique des factures</Text>
            <Pressable onPress={() => navigation.navigate('FacturationHistorique')}>
              <Text className="font-sans-semibold text-label-lg text-primary">Tout voir</Text>
            </Pressable>
          </View>
          <View className="gap-2">
            {INVOICES.map((invoice) => (
              <View key={invoice.id} className="flex-row items-center justify-between rounded-lg border border-outline-variant/20 p-md">
                <View className="flex-row items-center gap-md">
                  <MaterialIcons name="receipt-long" size={20} color={colors.onSurfaceVariant} />
                  <View>
                    <Text className="font-sans-semibold text-label-lg text-on-surface">{invoice.id}</Text>
                    <Text className="font-sans text-label-md text-on-surface-variant">{invoice.date}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{invoice.amount}</Text>
                  <Text className="font-sans text-[10px] text-secondary">{invoice.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row gap-md">
          <Pressable
            onPress={() => navigation.navigate('ParametresFacturation')}
            className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-outline"
          >
            <MaterialIcons name="tune" size={16} color={colors.primary} />
            <Text className="font-sans-semibold text-label-md text-primary">Paramètres</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ApprobationFactures')}
            className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-outline"
          >
            <MaterialIcons name="approval" size={16} color={colors.primary} />
            <Text className="font-sans-semibold text-label-md text-primary">Approbations</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
