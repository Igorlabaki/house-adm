export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  'text-secondary': string;
  error: string;
  success: string;
  warning: string;
  border: string;
  card: string;
};

export type ThemeSpacing = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
};

export type ThemeBorderRadius = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  round: string;
};

export type Theme = {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
};

export const theme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    'text-secondary': '#8E8E93',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    border: '#C7C7CC',
    card: '#F2F2F7',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '9999px',
  },
}; 