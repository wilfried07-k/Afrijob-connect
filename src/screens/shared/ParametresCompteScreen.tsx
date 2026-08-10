import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { setThemePreference, ThemePreference } from '../../theme/colorScheme';

type MenuItem = { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress?: () => void };
type MenuGroup = { title: string; items: MenuItem[] };

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
  userName?: string;
  userEmail?: string;
};

/**
 * Écran de paramètres générique, utilisé côté Candidat et Recruteur.
 * Chaque groupe reprend la structure `param_tres_du_compte` de la maquette.
 */
export default function ParametresCompteScreen({ navigation, userName = 'Guy-Bertrand', userEmail = 'guy.bertrand@example.cm' }: Props) {
  const groups: MenuGroup[] = [
    {
      title: 'Compte',
      items: [
        { icon: 'person', label: 'Informations personnelles' },
        { icon: 'work', label: 'Préférences de recherche' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: 'notifications-active', label: 'Alertes emploi', onPress: () => navigation.navigate('GestionAlertesEmploi') },
        { icon: 'mail', label: 'Messages' },
        { icon: 'newspaper', label: 'Actualités' },
        { icon: 'tune', label: 'Préférences de notifications', onPress: () => navigation.navigate('ParametresNotifications') },
      ],
    },
    {
      title: 'Sécurité',
      items: [
        { icon: 'vpn-key', label: 'Changer le mot de passe' },
        { icon: 'fingerprint', label: 'Authentification biométrique' },
        { icon: 'privacy-tip', label: 'Confidentialité' },
      ],
    },
    {
      title: 'Général',
      items: [
        { icon: 'language', label: 'Langue' },
        { icon: 'help-outline', label: "Centre d'assistance" },
      ],
    },
  ];

  const [themePref, setThemePref] = useState<ThemePreference>('system');
  const options: { key: ThemePreference; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { key: 'light', label: 'Clair', icon: 'light-mode' },
    { key: 'dark', label: 'Sombre', icon: 'dark-mode' },
    { key: 'system', label: 'Système', icon: 'smartphone' },
  ];

  const selectTheme = (pref: ThemePreference) => {
    setThemePref(pref);
    setThemePreference(pref);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">Paramètres</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        {/* Profile summary */}
        <View className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="relative">
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary-fixed bg-primary/10">
              <Text className="font-sans-bold text-title-lg text-primary">{userName[0]}</Text>
            </View>
            <View className="absolute bottom-0 right-0 rounded-full border-2 border-surface-container-lowest bg-primary p-1">
              <MaterialIcons name="edit" size={12} color="#ffffff" />
            </View>
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-headline-md text-on-surface">{userName}</Text>
            <Text className="font-sans text-body-md text-on-surface-variant">{userEmail}</Text>
            <Text className="mt-1 font-sans-semibold text-label-md text-primary">Modifier le profil</Text>
          </View>
        </View>

        {/* Theme selector */}
        <View className="gap-sm">
          <Text className="px-1 font-sans-semibold text-label-lg uppercase tracking-wider text-primary">
            Apparence
          </Text>
          <View className="flex-row gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-2 shadow-sm">
            {options.map((opt) => {
              const active = opt.key === themePref;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => selectTheme(opt.key)}
                  className={`flex-1 items-center gap-1 rounded-lg py-3 ${active ? 'bg-primary-container' : ''}`}
                >
                  <MaterialIcons name={opt.icon} size={20} color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant} />
                  <Text className={`font-sans-semibold text-label-md ${active ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {groups.map((group) => (
          <View key={group.title} className="gap-sm">
            <Text className="px-1 font-sans-semibold text-label-lg uppercase tracking-wider text-primary">
              {group.title}
            </Text>
            <View className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
              {group.items.map((item, index) => (
                <View key={item.label}>
                  <Pressable onPress={item.onPress} className="flex-row items-center p-md">
                    <MaterialIcons name={item.icon} size={20} color={colors.onSurfaceVariant} />
                    <Text className="ml-md flex-1 font-sans text-body-lg text-on-surface">{item.label}</Text>
                    <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
                  </Pressable>
                  {index < group.items.length - 1 && <View className="mx-md h-[1px] bg-outline-variant/10" />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-error/30 py-md">
          <MaterialIcons name="logout" size={18} color={colors.error} />
          <Text className="font-sans-semibold text-label-lg text-error">Déconnexion</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
