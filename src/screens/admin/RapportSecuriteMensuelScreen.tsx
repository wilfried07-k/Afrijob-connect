import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

const METRICS = [
  { label: 'Comptes bannis', value: '42', icon: 'block' as const, color: colors.error },
  { label: 'Litiges résolus', value: '128', icon: 'gavel' as const, color: colors.primary },
  { label: 'Fraudes détectées', value: '9', icon: 'bug-report' as const, color: colors.tertiary },
  { label: 'Dossiers KYC validés', value: '312', icon: 'verified-user' as const, color: colors.secondary },
];

const INCIDENTS = [
  { title: 'Vague de faux comptes recruteurs', severity: 'Élevée', status: 'Résolu' },
  { title: 'Tentative de phishing via SMS', severity: 'Moyenne', status: 'En surveillance' },
];

export default function RapportSecuriteMensuelScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Rapport de Sécurité</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between rounded-xl bg-primary p-lg shadow-lg">
          <View>
            <Text className="font-sans text-label-md text-white/70">Période</Text>
            <Text className="font-sans-bold text-title-lg text-white">Juin 2026</Text>
          </View>
          <Pressable className="flex-row items-center gap-1 rounded-xl bg-white px-md py-2">
            <MaterialIcons name="summarize" size={16} color={colors.primary} />
            <Text className="font-sans-semibold text-label-md text-primary">Exporter le rapport</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {METRICS.map((m) => (
            <View key={m.label} className="min-w-[47%] flex-1 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
              <MaterialIcons name={m.icon} size={20} color={m.color} />
              <Text className="font-sans text-[11px] text-on-surface-variant">{m.label}</Text>
              <Text className="font-sans-bold text-headline-md" style={{ color: m.color }}>{m.value}</Text>
            </View>
          ))}
        </View>

        <View className="gap-md">
          <Text className="font-sans-semibold text-title-lg text-on-surface">Incidents notables</Text>
          <View className="gap-2">
            {INCIDENTS.map((incident) => (
              <View key={incident.title} className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="crisis-alert" size={18} color={colors.error} />
                  <Text className="flex-1 font-sans-semibold text-label-lg text-on-surface">{incident.title}</Text>
                </View>
                <View className="flex-row gap-2">
                  <View className="rounded-full bg-error/10 px-2 py-0.5">
                    <Text className="text-[10px] font-sans-bold text-error">Sévérité : {incident.severity}</Text>
                  </View>
                  <View className="rounded-full bg-secondary/10 px-2 py-0.5">
                    <Text className="text-[10px] font-sans-bold text-secondary">{incident.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
