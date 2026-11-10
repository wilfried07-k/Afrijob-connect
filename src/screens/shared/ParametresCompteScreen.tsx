import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAuth } from '../../lib/auth';
import { changePassword } from '../../lib/api';
import { saveThemePreference, setThemePreference, useThemePreference, type ThemePreference } from '../../theme/colorScheme';
import { useLanguage } from '../../theme/language';

type Props = {
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void; getParent?: () => any };
};
type MenuItem = { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress: () => void };
type MenuGroup = { title: string; items: MenuItem[] };

export default function ParametresCompteScreen({ navigation }: Props) {
  const { authState, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const recruiter = authState.accountType === 'recruiter';
  const { current, setPreference } = useThemePreference();
  const [passwordModal, setPasswordModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const profileRoute = recruiter ? 'CreationProfilEntreprise' : 'CreationProfilCandidat';

  const changeTheme = async (preference: ThemePreference) => {
    setThemePreference(preference);
    try { await saveThemePreference(preference); }
    catch { Alert.alert('Thème non mémorisé', 'Le thème est actif mais ne pourra pas être restauré au prochain lancement.'); }
  };

  const logout = () => Alert.alert('Se déconnecter ?', 'Tu devras te reconnecter pour accéder à ton compte.', [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Déconnexion', style: 'destructive', onPress: () => {
      signOut();
      navigation.getParent?.()?.getParent?.()?.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } },
  ]);

  const groups: MenuGroup[] = [
    { title: 'Compte', items: [
      { icon: 'person', label: 'Informations personnelles', onPress: () => navigation.navigate(profileRoute) },
      { icon: 'work', label: recruiter ? 'Mes offres' : 'Mes alertes emploi', onPress: () => navigation.navigate(recruiter ? 'GestionDesOffres' : 'GestionAlertesEmploi') },
    ] },
    { title: 'Notifications', items: [
      { icon: 'notifications-active', label: 'Alertes emploi', onPress: () => navigation.navigate(recruiter ? 'GestionDesOffres' : 'GestionAlertesEmploi') },
      { icon: 'mail', label: recruiter ? 'Entretiens planifiés' : 'Messages et notifications', onPress: () => navigation.navigate(recruiter ? 'GestionEntretiensVideo' : 'Notifications') },
      { icon: 'newspaper', label: 'Actualités & conseils', onPress: () => navigation.navigate(recruiter ? 'FaqRecruteurs' : 'ConseilsCarriere') },
      { icon: 'tune', label: 'Préférences de notifications', onPress: () => navigation.navigate('ParametresNotifications') },
    ] },
    { title: 'Sécurité', items: [
      { icon: 'vpn-key', label: 'Changer le mot de passe', onPress: () => setPasswordModal(true) },
      { icon: 'fingerprint', label: 'Authentification biométrique indisponible sur cet appareil', onPress: () => Alert.alert('Fonction indisponible', 'La connexion biométrique n’est pas encore configurée dans cette version.') },
      { icon: 'privacy-tip', label: 'Confidentialité et mentions légales', onPress: () => navigation.navigate('MentionsLegales') },
    ] },
    { title: 'Général', items: [
      { icon: 'language', label: `Langue : ${language === 'fr' ? 'français' : 'English'}`, onPress: () => setLanguageModal(true) },
      { icon: 'help-outline', label: 'Centre d’assistance', onPress: () => navigation.navigate('CentreAssistance') },
    ] },
  ];

  const options: { key: ThemePreference; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { key: 'light', label: 'Clair', icon: 'light-mode' },
    { key: 'dark', label: 'Sombre', icon: 'dark-mode' },
    { key: 'system', label: 'Système', icon: 'smartphone' },
  ];
  const savePassword = async () => {
    if (!currentPassword || newPassword.length < 8) {
      Alert.alert('Informations requises', 'Saisis le mot de passe actuel et un nouveau mot de passe d’au moins 8 caractères.');
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordModal(false);
      setCurrentPassword(''); setNewPassword('');
      Alert.alert('Mot de passe modifié', 'Ton nouveau mot de passe est actif.');
    } catch (error) { Alert.alert('Erreur', (error as Error).message || 'Impossible de modifier le mot de passe.'); }
    finally { setSavingPassword(false); }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-16 flex-row items-center gap-3 px-container-margin">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}><MaterialIcons style={{ transform: [{ translateY: 4 }] }} name="arrow-back" size={24} color={colors.primary} /></Pressable>
        <Text className="font-sans-bold text-headline-md text-primary">{t('Paramètres')}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <Pressable onPress={() => navigation.navigate(profileRoute)} className="flex-row items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
          <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary-fixed bg-primary/10"><Text className="font-sans-bold text-title-lg text-primary">{authState.profile?.full_name?.[0]?.toUpperCase() || '?'}</Text></View>
          <View className="flex-1"><Text className="font-sans-semibold text-headline-md text-on-surface">{authState.profile?.full_name || 'Mon compte'}</Text><Text className="font-sans text-body-md text-on-surface-variant">{authState.profile?.email || ''}</Text><Text className="mt-1 font-sans-semibold text-label-md text-primary">Modifier le profil</Text></View>
          <MaterialIcons name="edit" size={20} color={colors.primary} />
        </Pressable>
        <View className="gap-sm"><Text className="px-1 font-sans-semibold text-label-lg uppercase tracking-wider text-primary">{t('Apparence')}</Text>
          <View className="flex-row gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-2 shadow-sm">
            {options.map((opt) => { const active = (current ?? 'system') === opt.key; return <Pressable key={opt.key} onPress={() => void changeTheme(opt.key)} className={`flex-1 items-center gap-1 rounded-lg py-3 ${active ? 'bg-primary-container' : ''}`}><MaterialIcons name={opt.icon} size={20} color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant} /><Text className={`font-sans-semibold text-label-md ${active ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{t(opt.label)}</Text></Pressable>; })}
          </View>
        </View>
        {groups.map((group) => <View key={group.title} className="gap-sm"><Text className="px-1 font-sans-semibold text-label-lg uppercase tracking-wider text-primary">{t(group.title)}</Text><View className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">{group.items.map((item, index) => <View key={item.label}><Pressable onPress={item.onPress} className="flex-row items-center p-md"><MaterialIcons name={item.icon} size={20} color={colors.onSurfaceVariant} /><Text className="ml-md flex-1 font-sans text-body-lg text-on-surface">{t(item.label)}</Text><MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} /></Pressable>{index < group.items.length - 1 && <View className="mx-md h-[1px] bg-outline-variant/10" />}</View>)}</View></View>)}
        <Pressable onPress={logout} className="flex-row items-center justify-center gap-2 rounded-xl border border-error/30 py-md"><MaterialIcons name="logout" size={18} color={colors.error} /><Text className="font-sans-semibold text-label-lg text-error">{t('Déconnexion')}</Text></Pressable>
      </ScrollView>
      <Modal visible={languageModal} transparent animationType="slide" onRequestClose={() => setLanguageModal(false)}><View className="flex-1 justify-end bg-black/40"><View className="gap-md rounded-t-2xl bg-surface-container-lowest p-lg"><Text className="font-sans-bold text-title-lg text-on-surface">Language / Langue</Text>{([{ key: 'fr', label: 'Français' }, { key: 'en', label: 'English' }] as const).map((option) => <Pressable key={option.key} onPress={() => { void setLanguage(option.key); setLanguageModal(false); }} className="flex-row items-center justify-between rounded-lg border border-outline-variant/30 px-md py-4"><Text className="font-sans-semibold text-body-lg text-on-surface">{option.label}</Text>{language === option.key ? <MaterialIcons name="check-circle" size={20} color={colors.primary} /> : null}</Pressable>)}<Pressable onPress={() => setLanguageModal(false)} className="items-center py-2"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">{t('Annuler')}</Text></Pressable></View></View></Modal>
      <Modal visible={passwordModal} transparent animationType="slide" onRequestClose={() => setPasswordModal(false)}>
        <View className="flex-1 justify-end bg-black/40"><View className="gap-4 rounded-t-2xl bg-surface-container-lowest p-6"><Text className="font-sans-bold text-headline-md text-primary">Changer le mot de passe</Text>
          <TextInput value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry autoCapitalize="none" placeholder="Mot de passe actuel" className="rounded-lg border border-outline-variant p-4 text-on-surface" />
          <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry autoCapitalize="none" placeholder="Nouveau mot de passe (8 caractères minimum)" className="rounded-lg border border-outline-variant p-4 text-on-surface" />
          <Pressable disabled={savingPassword} onPress={savePassword} className="items-center rounded-lg bg-primary py-4">{savingPassword ? <ActivityIndicator color="#ffffff" /> : <Text className="font-sans-semibold text-label-lg text-white">Enregistrer</Text>}</Pressable>
          <Pressable onPress={() => setPasswordModal(false)} className="items-center py-3"><Text className="font-sans-semibold text-label-lg text-on-surface-variant">Annuler</Text></Pressable>
        </View></View>
      </Modal>
    </View>
  );
}