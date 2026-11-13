import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#15161A',
    textSecondary: '#5B6068',
    background: '#F6F5F2',
    card: '#FFFFFF',
    cardSelected: '#ECEAE4',
    border: '#DEDBD3',
    accent: '#B3261E',
    onAccent: '#FFFFFF',
    success: '#1E7A46',
    danger: '#B3261E',
  },
  dark: {
    text: '#F3F2EE',
    textSecondary: '#A6A9B0',
    background: '#0F1012',
    card: '#1A1B1F',
    cardSelected: '#25272C',
    border: '#2F3238',
    accent: '#E5534B',
    onAccent: '#FFFFFF',
    success: '#4CC38A',
    danger: '#FF6B63',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
});

export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;

/** Content is centred and capped to this width so tablets don't get stretched layouts. */
export const MaxContentWidth = 960;
