/**
 * Thème central AfriJob Connect / EmploiCamer
 * Source : DESIGN.md (Pan-African Professional System)
 * Garde ce fichier synchronisé avec tailwind.config.js
 */

export const colors = {
  primary: '#004ac6',
  primaryContainer: '#2563eb',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#eeefff',
  primaryFixed: '#dbe1ff',
  onPrimaryFixed: '#00174b',

  secondary: '#006e2d',
  secondaryContainer: '#7cf994',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#007230',

  tertiary: '#943700',
  tertiaryContainer: '#bc4800',
  onTertiary: '#ffffff',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',

  background: '#faf8ff',
  onBackground: '#191b23',
  surface: '#faf8ff',
  surfaceContainerLow: '#f3f3fe',
  surfaceContainer: '#ededf9',
  surfaceContainerHigh: '#e7e7f3',
  onSurface: '#191b23',
  onSurfaceVariant: '#434655',

  outline: '#737686',
  outlineVariant: '#c3c6d7',
  inversePrimary: '#b4c5ff',

  // Couleurs de marque brutes utilisées dans certaines maquettes (prose DESIGN.md)
  brand: {
    blue: '#2563EB',
    green: '#16A34A',
    orange: '#F97316',
    surface: '#F8FAFC',
    navy: '#0F172A',
  },
} as const;

export const typography = {
  displayLg: { fontSize: 32, lineHeight: 40, fontFamily: 'PlusJakartaSans_700Bold' },
  headlineLg: { fontSize: 24, lineHeight: 32, fontFamily: 'PlusJakartaSans_700Bold' },
  headlineLgMobile: { fontSize: 22, lineHeight: 28, fontFamily: 'PlusJakartaSans_700Bold' },
  headlineMd: { fontSize: 20, lineHeight: 28, fontFamily: 'PlusJakartaSans_600SemiBold' },
  titleLg: { fontSize: 18, lineHeight: 24, fontFamily: 'PlusJakartaSans_600SemiBold' },
  bodyLg: { fontSize: 16, lineHeight: 24, fontFamily: 'PlusJakartaSans_400Regular' },
  bodyMd: { fontSize: 14, lineHeight: 20, fontFamily: 'PlusJakartaSans_400Regular' },
  labelLg: { fontSize: 14, lineHeight: 20, fontFamily: 'PlusJakartaSans_600SemiBold' },
  labelMd: { fontSize: 12, lineHeight: 16, fontFamily: 'PlusJakartaSans_500Medium' },
} as const;

export const radius = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  base: 8,
  md: 16,
  lg: 24,
  xl: 32,
  containerMargin: 20,
  gutter: 12,
} as const;
