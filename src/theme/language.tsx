import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type AppLanguage = 'fr' | 'en';

const STRINGS: Record<AppLanguage, Record<string, string>> = {
  fr: {},
  en: {
    'Accueil': 'Home',
    'Recherche': 'Search',
    'Favoris': 'Saved jobs',
    'Profil': 'Profile',
    'Bonjour,': 'Hello,',
    'Propulsez votre carrière vers de nouveaux horizons.': 'Move your career forward.',
    'Recherche intelligente (ex: Développeur, Comptable)': 'Search jobs (e.g. developer, accountant)',
    'Catégories': 'Categories',
    'Voir tout': 'See all',
    'Tech': 'Technology',
    'Santé': 'Healthcare',
    'Finance': 'Finance',
    'BTP': 'Construction',
    'Artisanat': 'Skilled trades',
    'Offres recommandées': 'Recommended jobs',
    'Entreprises vérifiées': 'Verified companies',
    'Découvrir': 'Explore',
    'Offres récentes': 'Recent jobs',
    'Compte': 'Account',
    'Carrière': 'Career',
    'Support': 'Support',
    'Préférences de recherche': 'Job preferences',
    'Mes candidatures': 'My applications',
    'Mon agenda': 'My calendar',
    'Mon CV': 'My resume',
    'Mon CV & Documents': 'Resume and documents',
    'Centre de préférences': 'Preference center',
    'Comparer les salaires': 'Compare salaries',
    'Messages': 'Messages',
    'Coach Carrière IA': 'AI career coach',
    'Rédaction assistée par IA': 'AI writing assistant',
    'Conseils Carrière': 'Career advice',
    'Tests de Compétences': 'Skills assessments',
    'Mon Portfolio': 'My portfolio',
    'Mon Réseau': 'My network',
    'Parrainage': 'Referrals',
    'Conditions & confidentialité': 'Terms and privacy',
    'Gérer mes documents': 'Manage my documents',
    'Modifier': 'Edit',
    'Candidatures': 'Applications',
    'Paramètres': 'Settings',
    'Apparence': 'Appearance',
    'Clair': 'Light',
    'Sombre': 'Dark',
    'Système': 'System',
    'Informations personnelles': 'Personal information',
    'Mes offres': 'My jobs',
    'Mes alertes emploi': 'My job alerts',
    'Notifications': 'Notifications',
    'Alertes emploi': 'Job alerts',
    'Entretiens planifiés': 'Scheduled interviews',
    'Messages et notifications': 'Messages and notifications',
    'Actualités & conseils': 'News and advice',
    'Préférences de notifications': 'Notification preferences',
    'Sécurité': 'Security',
    'Changer le mot de passe': 'Change password',
    'Authentification biométrique indisponible sur cet appareil': 'Biometric sign-in is unavailable on this device',
    'Confidentialité et mentions légales': 'Privacy and legal notices',
    'Général': 'General',
    'Langue : français': 'Language: French',
    'Langue : English': 'Language: English',
    "Centre d'assistance": 'Help center',
    'Déconnexion': 'Sign out',
    'Modifier le profil': 'Edit profile',
    'Voir mon profil public': 'View my public profile',
    'Mon compte': 'My account',
    'Enregistrer': 'Save',
    'Annuler': 'Cancel',
    'Mot de passe modifié': 'Password changed',
    'Ton nouveau mot de passe est actif.': 'Your new password is active.',
  },
};

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setCurrentLanguage] = useState<AppLanguage>('fr');

  useEffect(() => {
    const load = async () => {
      try {
        const saved = Platform.OS === 'web'
          ? globalThis.localStorage?.getItem('app-language')
          : await SecureStore.getItemAsync('app-language');
        if (saved === 'fr' || saved === 'en') setCurrentLanguage(saved);
      } catch {
        setCurrentLanguage('fr');
      }
    };
    void load();
  }, []);

  const setLanguage = async (value: AppLanguage) => {
    setCurrentLanguage(value);
    if (Platform.OS === 'web') globalThis.localStorage?.setItem('app-language', value);
    else await SecureStore.setItemAsync('app-language', value);
  };

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (text: string) => STRINGS[language][text] ?? text,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}