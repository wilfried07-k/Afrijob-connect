import { colorScheme, useColorScheme } from 'nativewind';

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

export function useThemePreference() {
  const { colorScheme: current, setColorScheme } = useColorScheme();
  return {
    current, // 'light' | 'dark' | undefined (undefined tant que non résolu)
    setPreference: setColorScheme,
  };
}
