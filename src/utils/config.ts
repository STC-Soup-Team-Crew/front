/**
 * Application Configuration
 * Update this file with your API endpoint and other settings
 */

// API Configuration
export const API_CONFIG = {
  // Base URL for API requests
  // This will be overridden by EXPO_PUBLIC_API_BASE_URL environment variable if set
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000',

  // API endpoints
  endpoints: {
    generateRecipe: '/api/recipes/generate',
    getRecipe: '/api/recipes',
    saveRecipe: '/recipes/save',
  },

  // Request timeout in milliseconds
  timeout: 30000,

  // Image upload settings
  image: {
    quality: 0.8,
    format: 'image/jpeg',
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

// App Configuration
export const APP_CONFIG = {
  appName: 'Meal Maker',
  appVersion: '1.0.0',
  minPhotoCaptureDimension: 300, // Minimum height/width for captured photos
};

// Feature Flags
export const FEATURES = {
  enableLoadingMessage: true,
  enableDetailedErrorMessages: true,
  enableRecipeSharing: true,
  enableProgressTracking: true,
};
