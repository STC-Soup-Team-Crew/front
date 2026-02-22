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

// ---------- Fridge Share types ----------
export interface FridgeListing {
  id: string;
  user_id: string;
  user_display_name: string;
  title: string;
  description?: string;
  items: string[];
  quantity?: string;
  expiry_hint?: string;
  pickup_instructions?: string;
  image_url?: string;
  status: 'available' | 'claimed' | 'deleted';
  claimed_by?: string;
  claimed_by_name?: string;
  created_at: string;
}

export interface FridgeListingPayload {
  user_id: string;
  user_display_name: string;
  title: string;
  description?: string;
  items: string[];
  quantity?: string;
  expiry_hint?: string;
  pickup_instructions?: string;
  image_url?: string;
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
   * Search recipes by ingredients
   * @param ingredients - Array of ingredient names to search for
   * @returns Array of matching recipes
   */
  async searchRecipesByIngredients(ingredients: string[]): Promise<RecipeResponse[]> {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/upload-image/', '') 
        || 'https://server-915802731426.us-west1.run.app/api/v1';
      const url = `${baseUrl}/recipes/search`;

      const response = await axios.get(url, {
        params: { ingredients: ingredients.join(',') },
        headers: { 'Accept': 'application/json' },
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
      console.error('Search API Error:', error);
      return [];
    }
  },

  /**
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

  // ---------- Fridge Share (leftover sharing) ----------

  _fridgeBaseUrl(): string {
    const base = process.env.EXPO_PUBLIC_API_URL?.replace('/upload-image/', '')
      || 'https://server-915802731426.us-west1.run.app/api/v1';
    return `${base}/fridge-listings`;
  },

  /**
   * Create a new fridge listing (post leftover items)
   */
  async createFridgeListing(payload: FridgeListingPayload): Promise<FridgeListing> {
    try {
      const response = await axios.post<FridgeListing>(this._fridgeBaseUrl(), payload, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Create Listing API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || error.message || 'Failed to create listing');
      }
      throw error;
    }
  },

  /**
   * Get available fridge listings (community feed)
   */
  async getFridgeListings(status: string = 'available'): Promise<FridgeListing[]> {
    try {
      const response = await axios.get<FridgeListing[]>(this._fridgeBaseUrl(), {
        params: { status },
        headers: { 'Accept': 'application/json' },
        timeout: 15000,
      });
      return response.data || [];
    } catch (error) {
      console.error('Get Fridge Listings API Error:', error);
      return [];
    }
  },

  /**
   * Get my own listings
   */
  async getMyFridgeListings(userId: string): Promise<FridgeListing[]> {
    try {
      const response = await axios.get<FridgeListing[]>(`${this._fridgeBaseUrl()}/mine`, {
        params: { user_id: userId },
        headers: { 'Accept': 'application/json' },
        timeout: 15000,
      });
      return response.data || [];
    } catch (error) {
      console.error('Get My Listings API Error:', error);
      return [];
    }
  },

  /**
   * Get a single listing by ID
   */
  async getFridgeListingById(listingId: string): Promise<FridgeListing | null> {
    try {
      const response = await axios.get<FridgeListing>(`${this._fridgeBaseUrl()}/${listingId}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      console.error('Get Listing By ID API Error:', error);
      return null;
    }
  },

  /**
   * Claim an available listing
   */
  async claimFridgeListing(listingId: string, claimedBy: string, claimedByName: string): Promise<FridgeListing> {
    try {
      const response = await axios.patch<FridgeListing>(
        `${this._fridgeBaseUrl()}/${listingId}/claim`,
        { claimed_by: claimedBy, claimed_by_name: claimedByName },
        { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, timeout: 15000 },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to claim listing');
      }
      throw error;
    }
  },

  /**
   * Delete a listing (owner only)
   */
  async deleteFridgeListing(listingId: string, userId: string): Promise<void> {
    try {
      await axios.delete(`${this._fridgeBaseUrl()}/${listingId}`, {
        params: { user_id: userId },
        headers: { 'Accept': 'application/json' },
        timeout: 15000,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to delete listing');
      }
      throw error;
    }
  },

  // ---------- Impact Tracking ----------

  _impactBaseUrl(): string {
    const base = process.env.EXPO_PUBLIC_API_URL?.replace('/upload-image/', '')
      || 'https://server-915802731426.us-west1.run.app/api/v1';
    return `${base}/impact`;
  },

  /**
   * Calculate and log environmental impact for ingredients
   * @param userId - User ID
   * @param ingredients - List of ingredients with name, quantity, unit
   * @param source - Source of the impact ('recipe', 'fridge_share', 'manual')
   * @param sourceId - Optional ID of the source recipe/listing
   */
  async calculateImpact(
    userId: string,
    ingredients: Array<{ name: string; quantity?: number; unit?: string }>,
    source: 'recipe' | 'fridge_share' | 'manual' = 'recipe',
    sourceId?: string
  ): Promise<{
    event_id: string;
    totals: { waste_prevented_kg: number; money_saved_usd: number; co2_avoided_kg: number };
    breakdown: Array<{ name: string; quantity: number; unit: string; weight_kg: number; cost_usd: number; co2_kg: number; found_in_lookup: boolean }>;
    gamification: {
      streak: number;
      is_new_streak_record: boolean;
      new_badges: Array<{ type: string; tier: string; name: string; description: string }>;
      weekly_progress: { current_kg: number; goal_kg: number; percentage: number; week_start: string };
    };
    message: string;
  }> {
    try {
      const response = await axios.post(
        `${this._impactBaseUrl()}/calculate`,
        {
          user_id: userId,
          ingredients: ingredients.map(i => ({
            name: i.name,
            quantity: i.quantity || 1,
            unit: i.unit || 'piece'
          })),
          source,
          source_id: sourceId
        },
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          timeout: 15000,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Calculate Impact API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to calculate impact');
      }
      throw error;
    }
  },

  /**
   * Get quick impact estimate without logging
   * @param ingredients - List of ingredients to estimate
   */
  async estimateImpact(
    ingredients: Array<{ name: string; quantity?: number; unit?: string }>
  ): Promise<{
    totals: { waste_prevented_kg: number; money_saved_usd: number; co2_avoided_kg: number };
    breakdown: Array<{ name: string; quantity: number; unit: string; weight_kg: number; cost_usd: number; co2_kg: number }>;
  }> {
    try {
      const response = await axios.post(
        `${this._impactBaseUrl()}/estimate`,
        ingredients.map(i => ({
          name: i.name,
          quantity: i.quantity || 1,
          unit: i.unit || 'piece'
        })),
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Estimate Impact API Error:', error);
      // Return zeros on error
      return {
        totals: { waste_prevented_kg: 0, money_saved_usd: 0, co2_avoided_kg: 0 },
        breakdown: []
      };
    }
  },

  /**
   * Get weekly and all-time impact summary for a user
   * @param userId - User ID
   */
  async getImpactSummary(userId: string): Promise<{
    user_id: string;
    this_week: { period: string; waste_kg: number; money_usd: number; co2_kg: number; event_count: number };
    last_week: { period: string; waste_kg: number; money_usd: number; co2_kg: number; event_count: number };
    all_time: { period: string; waste_kg: number; money_usd: number; co2_kg: number; event_count: number };
    weekly_goal: { current_kg: number; goal_kg: number; percentage: number; week_start: string };
    comparison: { waste_kg_change?: number; money_usd_change?: number; co2_kg_change?: number };
  }> {
    try {
      const response = await axios.get(`${this._impactBaseUrl()}/summary/${userId}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Get Impact Summary API Error:', error);
      // Return default values on error
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      
      return {
        user_id: userId,
        this_week: { period: 'this_week', waste_kg: 0, money_usd: 0, co2_kg: 0, event_count: 0 },
        last_week: { period: 'last_week', waste_kg: 0, money_usd: 0, co2_kg: 0, event_count: 0 },
        all_time: { period: 'all_time', waste_kg: 0, money_usd: 0, co2_kg: 0, event_count: 0 },
        weekly_goal: { current_kg: 0, goal_kg: 2, percentage: 0, week_start: weekStart.toISOString().split('T')[0] },
        comparison: {}
      };
    }
  },

  /**
   * Get gamification state (badges, streak, goals) for a user
   * @param userId - User ID
   */
  async getGamification(userId: string): Promise<{
    user_id: string;
    streak: { current: number; longest: number; last_active?: string; is_active_today: boolean };
    badges: Array<{ type: string; tier: string; name: string; description: string; earned_at?: string; progress?: number }>;
    weekly_goal: { current_kg: number; goal_kg: number; percentage: number; week_start: string };
    next_badge_progress?: { type: string; tier: string; name: string; description: string; progress: number; next_tier_threshold: number };
  }> {
    try {
      const response = await axios.get(`${this._impactBaseUrl()}/badges/${userId}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Get Gamification API Error:', error);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      
      return {
        user_id: userId,
        streak: { current: 0, longest: 0, is_active_today: false },
        badges: [],
        weekly_goal: { current_kg: 0, goal_kg: 2, percentage: 0, week_start: weekStart.toISOString().split('T')[0] }
      };
    }
  },

  /**
   * Update weekly goal for a user
   * @param userId - User ID
   * @param goalKg - New weekly goal in kg
   */
  async updateWeeklyGoal(userId: string, goalKg: number): Promise<{ message: string; success: boolean }> {
    try {
      const response = await axios.put(
        `${this._impactBaseUrl()}/goal`,
        { user_id: userId, weekly_goal_kg: goalKg },
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to update goal');
      }
      throw error;
    }
  },

  /**
   * Get recent impact events for a user
   * @param userId - User ID
   * @param limit - Maximum events to return (default 10)
   */
  async getImpactHistory(userId: string, limit: number = 10): Promise<{
    events: Array<{
      id: string;
      source: string;
      total_waste_kg: number;
      total_cost_usd: number;
      total_co2_kg: number;
      created_at: string;
    }>;
    count: number;
  }> {
    try {
      const response = await axios.get(`${this._impactBaseUrl()}/history/${userId}`, {
        params: { limit },
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Get Impact History API Error:', error);
      return { events: [], count: 0 };
    }
  },
};
