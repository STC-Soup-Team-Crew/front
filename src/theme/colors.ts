/**
 * Meal Maker V2 Theme Colors
 * Earthy green palette with warm accents
 */

export const colors = {
  // Primary palette
  background: '#92a64c',       // Main app background
  button: '#8a933a',           // Button background
  buttonText: '#f2ebd5',       // Button text color
  text: '#fcff8b',             // Primary text color

  // Surface & card colors
  surface: 'rgba(255, 255, 255, 0.12)',
  surfaceLight: 'rgba(255, 255, 255, 0.18)',
  surfaceSolid: '#a3b45a',

  // Semantic colors
  success: '#c8e06e',
  error: '#e85d5d',
  warning: '#f0c040',
  info: '#7ec8e3',

  // Utility
  white: '#FFFFFF',
  black: '#1A1A1A',
  overlay: 'rgba(0, 0, 0, 0.5)',
  divider: 'rgba(252, 255, 139, 0.2)',
  textMuted: 'rgba(252, 255, 139, 0.6)',
};

export type ColorKey = keyof typeof colors;
