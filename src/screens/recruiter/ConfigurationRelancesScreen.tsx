import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = { navigation: { goBack: () => void } };

type Rule = { id: string; label: string; description: string; enabled: boolean };

const DEFAULT_RULES: Rule[] = [
  { id: '1', label: 'Relancer après 3 jours sans réponse', description: 'Envoie un rappel automatique au candidat', enabled: true },
  { id: '2', label: "Notifier si offre sans candidature après 5 jours", description: 'Vous alerte pour ajuster votre annonce', enabled: true },
  { id: '3', label: "Clôturer automatiquement après 30 jours", description: "L'offre passe en statut Fermé automatiquement", enabled: false },
];

export default function ConfigurationRelancesScreen({ navigation }: Props) {
  const [rules, setRules] = useState(DEFAULT_RULES);

  const toggle = (id: string) =>
    setRules((list) => list.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Relances Automatiques</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}>
        <Text className="mb-1 font-sans text-body-md text-on-surface-variant">
          Automatisez le suivi de vos candidatures et offres pour gagner du temps.
        </Text>
        {rules.map((rule) => (
          <View key={rule.id} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <MaterialIcons name="send-time-extension" size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label-lg text-on-surface">{rule.label}</Text>
              <Text className="font-sans text-label-md text-on-surface-variant">{rule.description}</Text>
            </View>
            <Switch value={rule.enabled} onValueChange={() => toggle(rule.id)} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
