/**
 * API Service for Recipe Generation
 * Handles uploading fridge/pantry photos and retrieving recipe suggestions
 */

import axios from 'axios';
import * as FileSystem from 'expo-file-system';

interface RawRecipeResponse {
  Name: string;
  Ingredients: string;
  Steps: string;
  Time: number;
}

interface RecipeResponse {
  name: string;
  ingredients: string[];
  steps: string[];
  time?: number;
}

// Configure this with your actual API endpoint
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://server-915802731426.us-west1.run.app/api/v1/upload-image/';

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
      // Ensure the field name is 'file' as per the curl command
      formData.append('file', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'fridge_photo.jpg',
      } as any);

      // POST the photo to the API
      const response = await axios.post<RawRecipeResponse[]>(
        API_BASE_URL,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      if (!response.data || response.data.length === 0) {
        throw new Error('No recipe found in the response');
      }

      const rawRecipe = response.data[0];

      // Parse stringified arrays if they are strings, otherwise use as is
      const ingredients = typeof rawRecipe.Ingredients === 'string' 
        ? JSON.parse(rawRecipe.Ingredients) 
        : rawRecipe.Ingredients;
      
      const steps = typeof rawRecipe.Steps === 'string' 
        ? JSON.parse(rawRecipe.Steps) 
        : rawRecipe.Steps;

      return {
        name: rawRecipe.Name,
        ingredients: Array.isArray(ingredients) ? ingredients : [],
        steps: Array.isArray(steps) ? steps : [],
        time: rawRecipe.Time,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data || error.message);
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
    // Parse time string (e.g., "25 min") to an integer
    const timeValue = parseInt(payload.time.replace(/[^0-9]/g, ''), 10) || 0;
    
    return this.saveRecipe({
      name: payload.name,
      time: timeValue,
      ingredients: payload.ingredients,
      steps: payload.steps,
    });
  },

  /**
   * Save a recipe to the database
   * @param recipe - Recipe data to save
   */
  async saveRecipe(recipe: RecipeResponse): Promise<void> {
    try {
      const url = process.env.EXPO_PUBLIC_DATABASE_SAVE_RECIPE_URL || 'https://server-915802731426.us-west1.run.app/api/v1/recipes/save';
      
      // Payload format as requested: Single object with actual arrays for steps/ingredients
      const payload = {
        Name: recipe.name,
        Steps: recipe.steps,
        Time: recipe.time || 0,
        Ingredients: recipe.ingredients,
      };

      await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 15000,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Save API Error:', error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message ||
          error.message ||
          'Failed to save recipe'
        );
      }
      throw error;
    }
  },

  /**
   * Favorite a recipe for a specific user
   * @param userId - The user ID from AuthContext
   * @param recipe - Recipe data to favorite
   */
  async favoriteRecipe(userId: string, recipe: RecipeResponse): Promise<void> {
    try {
      const url = process.env.EXPO_PUBLIC_DATABASE_SAVE_RECIPE_URL?.replace('/save', '/favorite') || 'https://server-915802731426.us-west1.run.app/api/v1/recipes/favorite';
      
      const payload = {
        user_id: userId,
        Name: recipe.name,
        Steps: recipe.steps,
        Time: recipe.time || 0,
        Ingredients: recipe.ingredients,
      };

      await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 15000,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Favorite API Error:', error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message ||
          error.message ||
          'Failed to favorite recipe'
        );
      }
      throw error;
    }
  },

  /**
   * Get all favorite recipes for a specific user
   * @param userId - The user ID from AuthContext
   * @returns Array of favorite recipes
   */
  async getFavorites(userId: string): Promise<RecipeResponse[]> {
    try {
      const url = process.env.EXPO_PUBLIC_DATABASE_SAVE_RECIPE_URL?.replace('/save', '/favorite') || 'https://server-915802731426.us-west1.run.app/api/v1/recipes/favorite';
      
      const response = await axios.get(url, {
        params: { user_id: userId },
        headers: {
          'Accept': 'application/json',
        },
        timeout: 15000,
      });

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return response.data.map((raw: any) => ({
        name: raw.Name || raw.name,
        ingredients: typeof raw.Ingredients === 'string' ? JSON.parse(raw.Ingredients) : (raw.Ingredients || []),
        steps: typeof raw.Steps === 'string' ? JSON.parse(raw.Steps) : (raw.Steps || []),
        time: raw.Time || raw.time,
      }));
    } catch (error) {
      console.error('Get Favorites API Error:', error);
      return []; // Return empty array on error to prevent UI crash
    }
  },
};
