/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}) / ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: withOpacity('--color-surface'),
        'surface-dim': withOpacity('--color-surface-dim'),
        'surface-bright': withOpacity('--color-surface-bright'),
        'surface-container-lowest': withOpacity('--color-surface-container-lowest'),
        'surface-container-low': withOpacity('--color-surface-container-low'),
        'surface-container': withOpacity('--color-surface-container'),
        'surface-container-high': withOpacity('--color-surface-container-high'),
        'surface-container-highest': withOpacity('--color-surface-container-highest'),
        'surface-variant': withOpacity('--color-surface-variant'),
        'on-surface': withOpacity('--color-on-surface'),
        'on-surface-variant': withOpacity('--color-on-surface-variant'),
        'inverse-surface': withOpacity('--color-inverse-surface'),
        'inverse-on-surface': withOpacity('--color-inverse-on-surface'),
        outline: withOpacity('--color-outline'),
        'outline-variant': withOpacity('--color-outline-variant'),
        'surface-tint': withOpacity('--color-primary'),
        primary: withOpacity('--color-primary'),
        'on-primary': withOpacity('--color-on-primary'),
        'primary-container': withOpacity('--color-primary-container'),
        'on-primary-container': withOpacity('--color-on-primary-container'),
        'inverse-primary': withOpacity('--color-inverse-primary'),
        // Les tons "fixed" restent constants entre thèmes clair/sombre (spec Material 3)
        'primary-fixed': '#dbe1ff',
        'primary-fixed-dim': '#b4c5ff',
        'on-primary-fixed': '#00174b',
        'on-primary-fixed-variant': '#003ea8',
        secondary: withOpacity('--color-secondary'),
        'on-secondary': withOpacity('--color-on-secondary'),
        'secondary-container': withOpacity('--color-secondary-container'),
        'on-secondary-container': withOpacity('--color-on-secondary-container'),
        'secondary-fixed': '#7ffc97',
        'secondary-fixed-dim': '#62df7d',
        'on-secondary-fixed': '#002109',
        'on-secondary-fixed-variant': '#005320',
        tertiary: withOpacity('--color-tertiary'),
        'on-tertiary': withOpacity('--color-on-tertiary'),
        'tertiary-container': withOpacity('--color-tertiary-container'),
        'on-tertiary-container': withOpacity('--color-on-tertiary-container'),
        'tertiary-fixed': '#ffdbcd',
        'tertiary-fixed-dim': '#ffb596',
        'on-tertiary-fixed': '#360f00',
        'on-tertiary-fixed-variant': '#7d2d00',
        error: withOpacity('--color-error'),
        'on-error': withOpacity('--color-on-error'),
        'error-container': withOpacity('--color-error-container'),
        'on-error-container': withOpacity('--color-on-error-container'),
        background: withOpacity('--color-background'),
        'on-background': withOpacity('--color-on-background'),
        // Raw brand colors from DESIGN.md prose (used directly in some mockups) — constants
        'brand-blue': '#2563EB',
        'brand-green': '#16A34A',
        'brand-orange': '#F97316',
        'brand-surface': '#F8FAFC',
        'brand-navy': '#0F172A',
      },
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular'],
        'sans-medium': ['PlusJakartaSans_500Medium'],
        'sans-semibold': ['PlusJakartaSans_600SemiBold'],
        'sans-bold': ['PlusJakartaSans_700Bold'],
        'sans-extrabold': ['PlusJakartaSans_800ExtraBold'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        gutter: '12px',
        xl: '32px',
        base: '8px',
        sm: '8px',
        'container-margin': '20px',
        xs: '4px',
        md: '16px',
        lg: '24px',
      },
    },
  },
  plugins: [],
};
