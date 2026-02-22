/**
 * WeeklySummary Component
 * 
 * Displays weekly and all-time impact statistics with progress bar toward weekly goal.
 * Includes comparison with previous week.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../theme';
import { WeeklySummaryResponse } from '../../types/impact';

interface WeeklySummaryProps {
  summary: WeeklySummaryResponse;
  onGoalPress?: () => void;
  compact?: boolean;
}

interface ProgressBarProps {
  current: number;
  goal: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, goal, color = '#4CAF50' }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {current.toFixed(1)} / {goal.toFixed(1)} kg
      </Text>
    </View>
  );
};

interface ChangeIndicatorProps {
  change?: number;
  label: string;
}

const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ change, label }) => {
  if (change === undefined) return null;
  
  const isPositive = change >= 0;
  const color = isPositive ? '#4CAF50' : '#FF5722';
  const arrow = isPositive ? '↑' : '↓';
  
  return (
    <View style={styles.changeContainer}>
      <Text style={[styles.changeText, { color }]}>
        {arrow} {Math.abs(change).toFixed(0)}%
      </Text>
      <Text style={styles.changeLabel}>{label}</Text>
    </View>
  );
};

const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  summary,
  onGoalPress,
  compact = false,
}) => {
  const { this_week, last_week, all_time, weekly_goal, comparison } = summary;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle}>This Week</Text>
          <TouchableOpacity onPress={onGoalPress}>
            <Text style={styles.goalLink}>Set Goal</Text>
          </TouchableOpacity>
        </View>
        <ProgressBar current={weekly_goal.current_kg} goal={weekly_goal.goal_kg} />
        <View style={styles.compactStats}>
          <Text style={styles.compactStat}>
            🥬 {this_week.waste_kg.toFixed(1)}kg
          </Text>
          <Text style={styles.compactStat}>
            💰 ${this_week.money_usd.toFixed(0)}
          </Text>
          <Text style={styles.compactStat}>
            🌍 {this_week.co2_kg.toFixed(1)}kg CO₂
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Weekly Goal Progress */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Goal</Text>
          {onGoalPress && (
            <TouchableOpacity onPress={onGoalPress}>
              <Text style={styles.goalLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <ProgressBar current={weekly_goal.current_kg} goal={weekly_goal.goal_kg} />
        <Text style={styles.goalMessage}>
          {weekly_goal.percentage >= 100
            ? '🎉 Goal reached! Amazing work!'
            : `${(weekly_goal.goal_kg - weekly_goal.current_kg).toFixed(1)}kg to go!`}
        </Text>
      </View>

      {/* This Week Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🥬</Text>
            <Text style={styles.statValue}>{this_week.waste_kg.toFixed(2)}</Text>
            <Text style={styles.statLabel}>kg saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>${this_week.money_usd.toFixed(0)}</Text>
            <Text style={styles.statLabel}>saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🌍</Text>
            <Text style={styles.statValue}>{this_week.co2_kg.toFixed(1)}</Text>
            <Text style={styles.statLabel}>kg CO₂</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🍽️</Text>
            <Text style={styles.statValue}>{this_week.event_count}</Text>
            <Text style={styles.statLabel}>meals</Text>
          </View>
        </View>
      </View>

      {/* Comparison with Last Week */}
      {(comparison.waste_kg_change !== undefined || 
        comparison.money_usd_change !== undefined) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>vs Last Week</Text>
          <View style={styles.comparisonRow}>
            <ChangeIndicator change={comparison.waste_kg_change} label="waste" />
            <ChangeIndicator change={comparison.money_usd_change} label="savings" />
            <ChangeIndicator change={comparison.co2_kg_change} label="CO₂" />
          </View>
        </View>
      )}

      {/* All-Time Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Time Impact</Text>
        <View style={styles.allTimeContainer}>
          <View style={styles.allTimeItem}>
            <Text style={styles.allTimeValue}>
              {all_time.waste_kg.toFixed(1)}
              <Text style={styles.allTimeUnit}> kg</Text>
            </Text>
            <Text style={styles.allTimeLabel}>food saved</Text>
          </View>
          <View style={styles.allTimeDivider} />
          <View style={styles.allTimeItem}>
            <Text style={styles.allTimeValue}>
              ${all_time.money_usd.toFixed(0)}
            </Text>
            <Text style={styles.allTimeLabel}>saved</Text>
          </View>
          <View style={styles.allTimeDivider} />
          <View style={styles.allTimeItem}>
            <Text style={styles.allTimeValue}>
              {all_time.co2_kg.toFixed(0)}
              <Text style={styles.allTimeUnit}> kg</Text>
            </Text>
            <Text style={styles.allTimeLabel}>CO₂ avoided</Text>
          </View>
        </View>
      </View>

      {/* Fun Facts */}
      <View style={styles.funFact}>
        <Text style={styles.funFactText}>
          🌳 That's equivalent to {Math.round(all_time.co2_kg / 20)} trees absorbing CO₂ for a year!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadow.md,
  },
  compactContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  compactTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  compactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  compactStat: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  goalLink: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.buttonText,
  },
  progressBarContainer: {
    marginBottom: theme.spacing.sm,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
  goalMessage: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  changeContainer: {
    alignItems: 'center',
  },
  changeText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
  },
  changeLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
  },
  allTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  allTimeItem: {
    flex: 1,
    alignItems: 'center',
  },
  allTimeValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
  },
  allTimeUnit: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
  },
  allTimeLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
  },
  allTimeDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.divider,
    marginHorizontal: theme.spacing.sm,
  },
  funFact: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  funFactText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default WeeklySummary;
