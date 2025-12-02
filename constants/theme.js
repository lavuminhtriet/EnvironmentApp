import { Platform } from 'react-native';

const tintColorLight = '#1B5E20';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000000',
    textSecondary: '#424242',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#263238',
    tabIconDefault: '#B0BEC5',
    tabIconSelected: tintColorLight,
    primary: '#1B5E20',
    secondary: '#E8F5E9',
    accent: '#C0A062',
    surface: '#F8F9FA',
    border: '#E0E0E0',
    success: '#2E7D32',
    warning: '#F9A825',
    danger: '#C62828',
  },
  dark: {
    text: '#EEEEEE',
    background: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#1B5E20',
    secondary: '#1E1E1E',
    accent: '#C0A062',
    surface: '#1E1E1E',
    border: '#333333',
  },
};

// --- SỬA LẠI PHẦN NÀY ---
export const Fonts = {
  ios: {
    serifTitle: 'Georgia',
    sans: 'System',
  },
  android: {
    serifTitle: 'serif',
    sans: 'Roboto',
  },
  default: {
    serifTitle: 'serif',
    sans: 'sans-serif',
  }
};
// -------------------------