/**
 * StreakBanner Component
 * 
 * A compact banner showing the user's current streak.
 * Displays celebratory animations for special milestones.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { theme } from '../../theme';

interface StreakBannerProps {
  streak: number;
  isNewRecord?: boolean;
  lastActive?: string;
  compact?: boolean;
}

const MILESTONE_DAYS = [7, 14, 30, 50, 100, 365];

const StreakBanner: React.FC<StreakBannerProps> = ({
  streak,
  isNewRecord = false,
  lastActive,
  compact = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Check if streak is a milestone
  const isMilestone = MILESTONE_DAYS.includes(streak);
  const nextMilestone = MILESTONE_DAYS.find(m => m > streak) || streak + 1;
  const progressToNext = ((streak % nextMilestone) / nextMilestone) * 100;

  useEffect(() => {
    if (isNewRecord || isMilestone) {
      // Celebration animation
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isNewRecord, isMilestone]);

  const getStreakMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Day 1 - Great start!";
    if (streak < 7) return `${streak} days - Keep it up!`;
    if (streak === 7) return "1 week streak! 🎉";
    if (streak < 30) return `${streak} days - Amazing!`;
    if (streak === 30) return "1 month streak! 🏆";
    if (streak === 100) return "100 days! Legend! 👑";
    if (streak === 365) return "1 YEAR! Incredible! 🌟";
    return `${streak} days - Unstoppable!`;
  };

  const getStreakEmoji = () => {
    if (streak === 0) return "💫";
    if (streak < 7) return "🔥";
    if (streak < 30) return "🔥🔥";
    if (streak < 100) return "🔥🔥🔥";
    return "👑🔥";
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactEmoji}>🔥</Text>
        <Text style={styles.compactStreak}>{streak}</Text>
        <Text style={styles.compactLabel}>day{streak !== 1 ? 's' : ''}</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
        isMilestone && styles.milestoneContainer,
      ]}
    >
      {/* Glow effect for celebrations */}
      {(isNewRecord || isMilestone) && (
        <Animated.View
          style={[
            styles.glow,
            { opacity: glowAnim },
          ]}
        />
      )}

      <View style={styles.content}>
        {/* Streak Icon & Number */}
        <View style={styles.streakMain}>
          <Text style={styles.emoji}>{getStreakEmoji()}</Text>
          <View style={styles.streakNumber}>
            <Text style={styles.number}>{streak}</Text>
            <Text style={styles.dayLabel}>day{streak !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Message */}
        <Text style={styles.message}>{getStreakMessage()}</Text>

        {/* New Record Badge */}
        {isNewRecord && streak > 1 && (
          <View style={styles.newRecordBadge}>
            <Text style={styles.newRecordText}>🏅 New Record!</Text>
          </View>
        )}

        {/* Progress to next milestone */}
        {!isMilestone && streak > 0 && (
          <View style={styles.milestoneProgress}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                {nextMilestone - streak} days to {nextMilestone} day milestone
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(streak / nextMilestone) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  milestoneContainer: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  glow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: '#FFD700',
    opacity: 0.2,
  },
  content: {
    alignItems: 'center',
  },
  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  emoji: {
    fontSize: 28,
    marginRight: theme.spacing.sm,
  },
  streakNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  number: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text,
  },
  dayLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.xs,
  },
  message: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
  newRecordBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.sm,
  },
  newRecordText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: '#000',
  },
  milestoneProgress: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF5722',
    borderRadius: theme.borderRadius.full,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  compactEmoji: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  compactStreak: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  compactLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    marginLeft: 2,
  },
});

export default StreakBanner;
