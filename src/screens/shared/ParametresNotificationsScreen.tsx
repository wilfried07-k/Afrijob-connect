import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { getNotificationPreferences, saveNotificationPreferences, type NotificationPreferences } from '../../lib/api';

type Props = { navigation: { goBack: () => void } };
type Pref = { key: keyof Pick<NotificationPreferences, 'jobs' | 'messages' | 'applications' | 'interviews' | 'news' | 'marketing'>; icon: keyof typeof MaterialIcons.glyphMap; label: string; description: string };

const ITEMS: Pref[] = [
  { key: 'jobs', icon: 'notifications-active', label: 'Nouvelles offres', description: 'Alertes emploi correspondant à vos critères' },
  { key: 'messages', icon: 'mail', label: 'Messages', description: 'Nouveaux messages de recruteurs ou candidats' },
  { key: 'applications', icon: 'description', label: 'Suivi de candidatures', description: 'Mises à jour sur vos candidatures en cours' },
  { key: 'interviews', icon: 'event', label: 'Entretiens', description: 'Rappels avant vos entretiens programmés' },
  { key: 'news', icon: 'newspaper', label: 'Actualités & conseils', description: "Contenus éditoriaux de l'équipe EmploiCamer" },
  { key: 'marketing', icon: 'campaign', label: 'Offres promotionnelles', description: 'Réductions et nouveautés de la plateforme' },
];
const DEFAULTS: NotificationPreferences = { push_enabled: true, email_enabled: true, jobs: true, messages: true, applications: true, interviews: true, news: false, marketing: false };

export default function ParametresNotificationsScreen({ navigation }: Props) {
  const { authState } = useAuth();
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getNotificationPreferences().then((value) => { if (active) setPrefs(value); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : 'Impossible de charger les préférences.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [authState.userId]);

  const save = async () => {
    setSaving(true);
    try {
      const saved = await saveNotificationPreferences(prefs);
      setPrefs(saved);
      Alert.alert('Préférences enregistrées', 'Vos choix ont été sauvegardés sur votre compte.');
    } catch (err) {
      Alert.alert('Enregistrement impossible', err instanceof Error ? err.message : 'Réessayez plus tard.');
    } finally { setSaving(false); }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Notifications</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {loading ? <ActivityIndicator color={colors.primary} /> : <>
          {!!error && <Text className="font-sans text-body-md text-error">{error}</Text>}
          <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            {([{ key: 'push_enabled', label: 'Notifications push', icon: 'notifications' }, { key: 'email_enabled', label: 'Notifications email', icon: 'mail' }] as const).map((item, index) => (
              <View key={item.key}>
                {index > 0 && <View className="h-[1px] bg-outline-variant/20" />}
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center gap-3"><MaterialIcons name={item.icon} size={20} color={colors.primary} /><Text className="font-sans-semibold text-label-lg text-on-surface">{item.label}</Text></View>
                  <Switch value={prefs[item.key]} onValueChange={(value) => setPrefs((current) => ({ ...current, [item.key]: value }))} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
                </View>
              </View>
            ))}
          </View>
          <View className="gap-2">
            <Text className="px-1 font-sans-semibold text-label-lg uppercase tracking-wider text-primary">Types de notifications</Text>
            <View className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
              {ITEMS.map((item) => (
                <View key={item.key} className="flex-row items-center gap-md p-md">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-high"><MaterialIcons name={item.icon} size={18} color={colors.onSurfaceVariant} /></View>
                  <View className="flex-1"><Text className="font-sans-semibold text-label-lg text-on-surface">{item.label}</Text><Text className="font-sans text-label-md text-on-surface-variant">{item.description}</Text></View>
                  <Switch value={prefs[item.key]} onValueChange={(value) => setPrefs((current) => ({ ...current, [item.key]: value }))} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
                </View>
              ))}
            </View>
          </View>
          <Pressable disabled={saving || !!error} onPress={save} className="items-center justify-center rounded-xl bg-primary py-4 opacity-100">
            {saving ? <ActivityIndicator color="#ffffff" /> : <Text className="font-sans-semibold text-label-lg text-white">Enregistrer mes préférences</Text>}
          </Pressable>
        </>}
      </ScrollView>
    </View>
  );
}