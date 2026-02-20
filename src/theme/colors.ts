/**
 * Eco-Friendly Theme Colors
 * Green, earth tones, and natural palette
 */

export const colors = {
  // Primary eco-green tones
  primary: '#2D6A4F',        // Deep forest green
  primaryLight: '#52B788',   // Light eco-green
  primaryLighter: '#A8DADC', // Very light green

  // Secondary earth tones
  secondary: '#6B8E23',      // Olive green
  secondaryLight: '#9ACD32', // Yellow-green

  // Accent colors
  accent: '#F4A460',         // Sandy brown (nature inspired)
  accentLight: '#FFD699',    // Light sandy
  
  // Neutral palette
  white: '#FFFFFF',
  offWhite: '#F5F5F5',
  lightGray: '#E8E8E8',
  gray: '#9CA3AF',
  darkGray: '#4B5563',
  black: '#1A1A1A',

  // Semantic colors
  success: '#10B981',        // Green for success
  error: '#EF4444',          // Red for errors
  warning: '#F97316',        // Orange for warnings
  info: '#3B82F6',           // Blue for info

  // Background
  background: '#F9FAFB',     // Off-white background
  surface: '#FFFFFF',        // Card/surface background
  surfaceVariant: '#F0FDF4', // Subtle green tint

  // Text colors
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
};

export const gradients = {
  primaryGradient: ['#2D6A4F', '#52B788'],
  ecoGradient: ['#1B4D35', '#2D6A4F', '#52B788'],
  warmGradient: ['#6B8E23', '#F4A460'],
};

export type ColorKey = keyof typeof colors;
