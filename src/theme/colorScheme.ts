import { colorScheme, useColorScheme } from 'nativewind';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Bascule le thème de l'app entière (fond, textes, bordures...) sans avoir
 * à toucher aux 70+ écrans : ils utilisent tous les classes sémantiques
 * NativeWind (bg-background, text-on-surface, etc.) dont les valeurs sont
 * pilotées par les variables CSS définies dans global.css (:root / .dark).
 */
export function setThemePreference(preference: ThemePreference) {
  colorScheme.set(preference);
}

export async function loadThemePreference(): Promise<ThemePreference | null> {
  const value = Platform.OS === 'web'
    ? globalThis.localStorage?.getItem('theme-preference')
    : await SecureStore.getItemAsync('theme-preference');
  return value === 'light' || value === 'dark' || value === 'system' ? value : null;
}

export async function saveThemePreference(preference: ThemePreference) {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem('theme-preference', preference);
  } else {
    await SecureStore.setItemAsync('theme-preference', preference);
  }
}

export function useThemePreference() {
  const { colorScheme: current, setColorScheme } = useColorScheme();
  return {
    current, // 'light' | 'dark' | undefined (undefined tant que non résolu)
    setPreference: setColorScheme,
  };
}
