import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

/**
 * Destination : src/screens/admin/TableauDeBordCNPSScreen.tsx
 *
 * Tableau de bord institutionnel destiné à un partenariat avec la CNPS :
 * volume d'emplois formalisés via la plateforme, cotisations générées,
 * taux de conformité des entreprises. C'est l'écran à montrer en priorité
 * dans une présentation à la CNPS — il traduit directement la valeur de la
 * plateforme pour eux (plus de cotisants déclarés, données fiables).
 */

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
};

const METRICS = [
  { label: 'Embauches formalisées (DIPE)', value: '2 840', icon: 'fact-check' as const, color: colors.primary, trend: '+22% ce trimestre' },
  { label: 'Nouveaux cotisants', value: '2 140', icon: 'person-add' as const, color: colors.secondary, trend: '+18%' },
  { label: 'Cotisations transmises', value: '186M FCFA', icon: 'account-balance' as const, color: colors.tertiary, trend: '+14%' },
  { label: 'Entreprises conformes', value: '91%', icon: 'verified-user' as const, color: colors.secondary },
];

const REGIONS = [
  { name: 'Littoral (Douala)', declared: 1240, compliance: 94 },
  { name: 'Centre (Yaoundé)', declared: 980, compliance: 89 },
  { name: 'Ouest (Bafoussam)', declared: 320, compliance: 82 },
  { name: 'Nord-Ouest / Sud-Ouest', declared: 300, compliance: 76 },
];

export default function TableauDeBordCNPSScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="account-balance" size={20} color={colors.primary} />
          <Text className="font-sans-bold text-headline-md text-primary">Formalisation & CNPS</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <Text className="font-sans text-body-md text-on-surface-variant">
          Impact de la plateforme sur la formalisation de l'emploi et la collecte de cotisations
          sociales, par trimestre.
        </Text>

        {/* Metrics */}
        <View className="flex-row flex-wrap gap-2">
          {METRICS.map((m) => (
            <View key={m.label} className="min-w-[47%] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: m.color + '1A' }}>
                <MaterialIcons name={m.icon} size={18} color={m.color} />
              </View>
              <Text className="font-sans text-[11px] text-on-surface-variant">{m.label}</Text>
              <Text className="font-sans-bold text-headline-md" style={{ color: m.color }}>{m.value}</Text>
              {m.trend && (
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="trending-up" size={12} color={colors.secondary} />
                  <Text className="text-[10px] font-sans-semibold text-secondary">{m.trend}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Regional breakdown */}
        <View className="gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Répartition régionale</Text>
          <View className="gap-md">
            {REGIONS.map((r) => (
              <View key={r.name} className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-medium text-label-lg text-on-surface-variant">{r.name}</Text>
                  <Text className="font-sans-semibold text-label-md text-on-surface">
                    {r.declared} déclarations
                  </Text>
                </View>
                <View className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <View
                    className={`h-full rounded-full ${r.compliance > 90 ? 'bg-secondary' : r.compliance > 80 ? 'bg-primary' : 'bg-tertiary'}`}
                    style={{ width: `${r.compliance}%` }}
                  />
                </View>
                <Text className="font-sans text-[11px] text-outline">{r.compliance}% de conformité entreprises</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Partnership value proposition */}
        <View className="gap-md rounded-xl bg-primary p-lg shadow-lg">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="handshake" size={20} color="#ffffff" />
            <Text className="font-sans-semibold text-title-lg text-white">Rapport pour partenaire institutionnel</Text>
          </View>
          <Text className="font-sans text-body-md text-white/85">
            Générez un export détaillé (déclarations DIPE, cotisations collectées, taux de conformité
            par secteur) à transmettre à la CNPS pour le suivi du partenariat.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('ExportationRapport')}
            className="mt-1 flex-row items-center justify-center gap-2 rounded-xl bg-white py-3"
          >
            <MaterialIcons name="ios-share" size={18} color={colors.primary} />
            <Text className="font-sans-semibold text-label-lg text-primary">Générer le rapport CNPS</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
