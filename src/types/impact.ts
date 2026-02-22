/**
 * TypeScript types for the Impact Tracking system.
 * Mirrors the backend Pydantic schemas for type safety.
 */

// =============================================================================
// Enums
// =============================================================================

export type ImpactSource = 'recipe' | 'fridge_share' | 'manual';

export type BadgeTier = 'bronze' | 'silver' | 'gold';

export type BadgeType = 
  | 'waste_saver' 
  | 'money_saver' 
  | 'carbon_hero' 
  | 'streak_master' 
  | 'recipe_chef' 
  | 'community_hero';

// =============================================================================
// Input Types
// =============================================================================

export interface IngredientInput {
  name: string;
  quantity?: number;
  unit?: string;
}

export interface ImpactCalculationRequest {
  user_id: string;
  ingredients: IngredientInput[];
  source?: ImpactSource;
  source_id?: string;
}

export interface WeeklyGoalUpdateRequest {
  user_id: string;
  weekly_goal_kg: number;
}

// =============================================================================
// Output Types - Impact Calculation
// =============================================================================

export interface IngredientImpact {
  name: string;
  quantity: number;
  unit: string;
  weight_kg: number;
  cost_usd: number;
  co2_kg: number;
  found_in_lookup: boolean;
}

export interface ImpactTotals {
  waste_prevented_kg: number;
  money_saved_usd: number;
  co2_avoided_kg: number;
}

export interface WeeklyProgress {
  current_kg: number;
  goal_kg: number;
  percentage: number;
  week_start: string; // ISO date string
}

export interface GamificationUpdate {
  streak: number;
  is_new_streak_record: boolean;
  new_badges: BadgeInfo[];
  weekly_progress: WeeklyProgress;
}

export interface ImpactCalculationResponse {
  event_id: string;
  totals: ImpactTotals;
  breakdown: IngredientImpact[];
  gamification: GamificationUpdate;
  message: string;
}

// =============================================================================
// Output Types - Summary & Aggregation
// =============================================================================

export interface PeriodSummary {
  period: string;
  waste_kg: number;
  money_usd: number;
  co2_kg: number;
  event_count: number;
  start_date?: string;
  end_date?: string;
}

export interface WeeklySummaryResponse {
  user_id: string;
  this_week: PeriodSummary;
  last_week: PeriodSummary;
  all_time: PeriodSummary;
  weekly_goal: WeeklyProgress;
  comparison: {
    waste_kg_change?: number;
    money_usd_change?: number;
    co2_kg_change?: number;
  };
}

// =============================================================================
// Output Types - Gamification
// =============================================================================

export interface BadgeInfo {
  type: BadgeType;
  tier: BadgeTier;
  name: string;
  description: string;
  earned_at?: string; // ISO datetime string
  progress?: number;
  next_tier_threshold?: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  last_active?: string; // ISO date string
  is_active_today: boolean;
}

export interface GamificationResponse {
  user_id: string;
  streak: StreakInfo;
  badges: BadgeInfo[];
  weekly_goal: WeeklyProgress;
  next_badge_progress?: BadgeInfo;
}

// =============================================================================
// Impact Event (for history)
// =============================================================================

export interface ImpactEvent {
  id: string;
  user_id: string;
  source: ImpactSource;
  source_id?: string;
  ingredients: IngredientImpact[];
  total_waste_kg: number;
  total_cost_usd: number;
  total_co2_kg: number;
  status: 'active' | 'reversed' | 'deleted';
  created_at: string;
}

export interface ImpactHistoryResponse {
  events: ImpactEvent[];
  count: number;
}

// =============================================================================
// Component Props Interfaces
// =============================================================================

export interface ImpactCardProps {
  totals: ImpactTotals;
  source?: ImpactSource;
  showBreakdown?: boolean;
  breakdown?: IngredientImpact[];
  onClose?: () => void;
  animated?: boolean;
}

export interface WeeklySummaryProps {
  summary: WeeklySummaryResponse;
  onGoalPress?: () => void;
  compact?: boolean;
}

export interface BadgeDisplayProps {
  badges: BadgeInfo[];
  streak: StreakInfo;
  showProgress?: boolean;
  onBadgePress?: (badge: BadgeInfo) => void;
}

export interface StreakBannerProps {
  streak: number;
  isNewRecord?: boolean;
  lastActive?: string;
}

// =============================================================================
// Utility Types
// =============================================================================

export interface ImpactEstimateResponse {
  totals: ImpactTotals;
  breakdown: IngredientImpact[];
  note: string;
}

// Badge display metadata for UI
export const BADGE_DISPLAY_INFO: Record<BadgeType, { icon: string; color: string }> = {
  waste_saver: { icon: '🥬', color: '#4CAF50' },
  money_saver: { icon: '💰', color: '#FFC107' },
  carbon_hero: { icon: '🌍', color: '#2196F3' },
  streak_master: { icon: '🔥', color: '#FF5722' },
  recipe_chef: { icon: '👨‍🍳', color: '#9C27B0' },
  community_hero: { icon: '🤝', color: '#00BCD4' },
};

// Badge tier colors
export const TIER_COLORS: Record<BadgeTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
};
