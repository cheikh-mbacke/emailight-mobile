/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  // Couleurs spécifiques à Emailight
  emailight: {
    primary: '#d4a574',
    primaryDark: '#c8956d',
    primaryLight: '#e6c4a0',
    
    text: {
      primary: '#4a3728',
      secondary: '#5a412f',
      light: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.9)',
    },
    
    background: {
      overlay: 'rgba(0, 0, 0, 0.7)',
      card: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(255, 255, 255, 0.5)',
      testimonial: 'rgba(139, 69, 19, 0.95)',
      tagline: 'rgba(0, 0, 0, 0.5)',
    },
    
    shadow: {
      color: '#000',
      primary: '#d4a574',
    }
  }
};
