/**
 * API Service for Recipe Generation
 * Handles uploading fridge/pantry photos and retrieving recipe suggestions
 */

import axios from 'axios';
import * as FileSystem from 'expo-file-system';

interface RecipeResponse {
  name: string;
  ingredients: string[];
  steps: string[];
}

// Configure this with your actual API endpoint
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const apiService = {
  /**
   * Upload a photo to the API and get recipe suggestions
   * @param photoUri - Local file URI of the photo
   * @returns Recipe data from the API
   */
  async uploadPhotoAndGetRecipe(photoUri: string): Promise<RecipeResponse> {
    try {
      // The FormData approach handles encoding automatically
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'fridge_photo.jpg',
      } as any);

      // POST the photo to the API
      const uploadResponse = await axios.post(
        `${API_BASE_URL}/api/recipes/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      // Extract the recipe ID or identifier from the response
      const recipeId = uploadResponse.data.recipe_id || uploadResponse.data.id;

      if (!recipeId) {
        throw new Error('No recipe ID received from API');
      }

      // GET the full recipe details
      const recipeResponse = await axios.get<RecipeResponse>(
        `${API_BASE_URL}/api/recipes/${recipeId}`,
        {
          timeout: 15000,
        }
      );

      return recipeResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
          error.message ||
          'Failed to process recipe request'
        );
      }
      throw error;
    }
  },

  /**
   * Set a new API base URL
   * @param baseUrl - The new API base URL
   */
  setBaseUrl(baseUrl: string): void {
    // This can be called at app startup if the API URL is dynamic
    console.log(`API Base URL set to: ${baseUrl}`);
  },

  /**
   * Create a new recipe via POST
   * @param payload - Recipe data with name, time, ingredients, steps
   */
  async createRecipe(payload: {
    name: string;
    time: string;
    ingredients: string[];
    steps: string[];
  }): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/recipes`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
          error.message ||
          'Failed to create recipe'
        );
      }
      throw error;
    }
  },
};
