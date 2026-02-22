/**
 * Impact Tracking Components
 * 
 * Reusable UI components for displaying environmental impact,
 * gamification elements, and user progress.
 */

export { default as ImpactCard } from './ImpactCard';
export { default as WeeklySummary } from './WeeklySummary';
export { default as BadgeDisplay } from './BadgeDisplay';
export { default as StreakBanner } from './StreakBanner';

// Re-export types for convenience
export type {
  ImpactCardProps,
  WeeklySummaryProps,
  BadgeDisplayProps,
  StreakBannerProps,
} from '../../types/impact';
