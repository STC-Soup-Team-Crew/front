/**
 * Meal Master V3 Theme Colors
 */

export const colors = {
  // Primary palette
  background: '#6b8f26',       // Wallpaper / main background
  button: '#41541A',           // Button background
  buttonText: '#fbff70',       // Button text
  text: '#fbff70',             // Primary text color

  // Surface & card colors
  surface: 'rgba(255, 255, 255, 0.12)',
  surfaceLight: 'rgba(255, 255, 255, 0.18)',
  surfaceSolid: '#5a7a1e',

  // Semantic colors
  success: '#a8d84e',
  error: '#e85d5d',
  warning: '#f0c040',
  info: '#7ec8e3',

  // Utility
  white: '#FFFFFF',
  black: '#1A1A1A',
  overlay: 'rgba(0, 0, 0, 0.5)',
  divider: 'rgba(251, 255, 112, 0.2)',
  textMuted: 'rgba(251, 255, 112, 0.6)',

  // Tab bar
  tabBarBackground: '#3a4c12',
  tabBarActive: '#fbff70',
  tabBarInactive: 'rgba(251, 255, 112, 0.4)',
};

export type ColorKey = keyof typeof colors;
