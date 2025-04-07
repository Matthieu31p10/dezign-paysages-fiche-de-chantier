
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface LayoutPreferences {
  sidebarPosition: 'left' | 'right';
  compactMode: boolean;
  cardStyle: 'default' | 'minimal' | 'bordered';
  fontSize: 'small' | 'medium' | 'large';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  colors: ThemeColors;
  layout: LayoutPreferences;
}

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  colors: {
    primary: 'hsl(142, 70%, 45%)',
    secondary: 'hsl(150, 20%, 96%)',
    accent: 'hsl(142, 50%, 96%)',
    background: 'hsl(150, 30%, 99%)'
  },
  layout: {
    sidebarPosition: 'left',
    compactMode: false,
    cardStyle: 'default',
    fontSize: 'medium'
  }
};
