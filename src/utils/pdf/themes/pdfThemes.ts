
import { PDFTheme } from '../types';

// Define base theme properties
export const baseTheme: PDFTheme = {
  fonts: {
    title: {
      family: 'helvetica',
      style: 'bold',
      size: 14
    },
    subtitle: {
      family: 'helvetica',
      style: 'bold',
      size: 12
    },
    body: {
      family: 'helvetica',
      style: 'normal',
      size: 10
    },
    small: {
      family: 'helvetica',
      style: 'normal',
      size: 8
    }
  },
  colors: {
    primary: [61, 90, 254],    // Blue
    secondary: [70, 128, 131], // Teal
    accent: [61, 174, 43],     // Green
    text: [60, 60, 60],        // Dark gray
    lightText: [120, 120, 120],// Light gray
    background: [255, 255, 255],// White
    lightGrey: [248, 248, 248], // Light grey for backgrounds
    border: [220, 220, 220]    // Border color
  },
  spacing: {
    margin: 10,
    sectionGap: 12,
    paragraphGap: 6
  }
};

// Modern clean theme
export const modernTheme: PDFTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: [41, 98, 255],    // Bright blue
    secondary: [75, 85, 99],   // Slate gray
    accent: [16, 185, 129],    // Emerald
  }
};

// Professional dark theme
export const professionalTheme: PDFTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: [30, 58, 138],    // Dark blue
    secondary: [31, 41, 55],   // Dark gray
    accent: [5, 150, 105],     // Dark teal
    text: [23, 23, 23]         // Almost black
  }
};

// Nature theme
export const natureTheme: PDFTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: [22, 101, 52],    // Forest green
    secondary: [120, 113, 108],// Stone
    accent: [180, 83, 9],      // Amber/orange
  }
};

// Get theme by name
export const getTheme = (themeName?: string): PDFTheme => {
  switch (themeName?.toLowerCase()) {
    case 'modern':
      return modernTheme;
    case 'professional':
      return professionalTheme;
    case 'nature':
      return natureTheme;
    default:
      return baseTheme;
  }
};
