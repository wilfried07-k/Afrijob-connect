import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Props = {
  navigation: { goBack: () => void };
};

type Pref = { key: string; icon: keyof typeof MaterialIcons.glyphMap; label: string; description: string; value: boolean };

const DEFAULT_PREFS: Pref[] = [
  { key: 'jobs', icon: 'notifications-active', label: 'Nouvelles offres', description: 'Alertes emploi correspondant à vos critères', value: true },
  { key: 'messages', icon: 'mail', label: 'Messages', description: 'Nouveaux messages de recruteurs ou candidats', value: true },
  { key: 'applications', icon: 'description', label: 'Suivi de candidatures', description: 'Mises à jour sur vos candidatures en cours', value: true },
  { key: 'interviews', icon: 'event', label: 'Entretiens', description: 'Rappels avant vos entretiens programmés', value: true },
  { key: 'news', icon: 'newspaper', label: 'Actualités & conseils', description: "Contenus éditoriaux de l'équipe EmploiCamer", value: false },
  { key: 'marketing', icon: 'campaign', label: 'Offres promotionnelles', description: 'Réductions et nouveautés de la plateforme', value: false },
];

export default function ParametresNotificationsScreen({ navigation }: Props) {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const toggle = (key: string) =>
    setPrefs((list) => list.map((p) => (p.key === key ? { ...p, value: !p.value } : p)));

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Notifications</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Channels */}
        <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="notifications" size={20} color={colors.primary} />
              <Text className="font-sans-semibold text-label-lg text-on-surface">Notifications push</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
          </View>
          <View className="h-[1px] bg-outline-variant/20" />
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="mail" size={20} color={colors.primary} />
              <Text className="font-sans-semibold text-label-lg text-on-surface">Notifications email</Text>
            </View>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
          </View>
        </View>

        {/* Individual preferences */}
        <View className="gap-2">
          <Text className="px-1 font-sans-semibold text-label-lg uppercase tracking-wider text-primary">
            Types de notifications
          </Text>
          <View className="divide-y divide-outline-variant/10 rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
            {prefs.map((pref) => (
              <View key={pref.key} className="flex-row items-center gap-md p-md">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
                  <MaterialIcons name={pref.icon} size={18} color={colors.onSurfaceVariant} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-label-lg text-on-surface">{pref.label}</Text>
                  <Text className="font-sans text-label-md text-on-surface-variant">{pref.description}</Text>
                </View>
                <Switch
                  value={pref.value}
                  onValueChange={() => toggle(pref.key)}
                  trackColor={{ true: colors.primary, false: colors.outlineVariant }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
