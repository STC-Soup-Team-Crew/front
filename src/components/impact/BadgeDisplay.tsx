/**
 * BadgeDisplay Component
 * 
 * Displays earned badges and progress toward next badges.
 * Includes streak information and motivational elements.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { theme } from '../../theme';
import { BadgeInfo, StreakInfo, BadgeType, BadgeTier, BADGE_DISPLAY_INFO, TIER_COLORS } from '../../types/impact';

interface BadgeDisplayProps {
  badges: BadgeInfo[];
  streak: StreakInfo;
  showProgress?: boolean;
  onBadgePress?: (badge: BadgeInfo) => void;
  nextBadge?: BadgeInfo;
}

interface BadgeItemProps {
  badge: BadgeInfo;
  onPress?: () => void;
  showProgress?: boolean;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge, onPress, showProgress }) => {
  const displayInfo = BADGE_DISPLAY_INFO[badge.type];
  const tierColor = TIER_COLORS[badge.tier];

  return (
    <TouchableOpacity
      style={styles.badgeItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.badgeIcon, { borderColor: tierColor }]}>
        <Text style={styles.badgeEmoji}>{displayInfo.icon}</Text>
        <View style={[styles.tierBadge, { backgroundColor: tierColor }]}>
          <Text style={styles.tierText}>{badge.tier.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
      {showProgress && badge.progress !== undefined && badge.progress < 100 && (
        <View style={styles.miniProgress}>
          <View
            style={[styles.miniProgressFill, { width: `${badge.progress}%`, backgroundColor: tierColor }]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

interface LockedBadgeProps {
  type: BadgeType;
  progress?: number;
  nextThreshold?: number;
}

const LockedBadge: React.FC<LockedBadgeProps> = ({ type, progress, nextThreshold }) => {
  const displayInfo = BADGE_DISPLAY_INFO[type];

  return (
    <View style={styles.lockedBadgeItem}>
      <View style={styles.lockedBadgeIcon}>
        <Text style={styles.lockedEmoji}>{displayInfo.icon}</Text>
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      </View>
      {progress !== undefined && (
        <Text style={styles.lockedProgress}>{progress.toFixed(0)}%</Text>
      )}
    </View>
  );
};

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  streak,
  showProgress = true,
  onBadgePress,
  nextBadge,
}) => {
  // Get earned badge types
  const earnedTypes = new Set(badges.map(b => b.type));
  
  // All badge types for showing locked badges
  const allBadgeTypes: BadgeType[] = [
    'waste_saver',
    'money_saver',
    'carbon_hero',
    'streak_master',
    'recipe_chef',
    'community_hero'
  ];

  return (
    <View style={styles.container}>
      {/* Streak Section */}
      <View style={styles.streakSection}>
        <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{streak.current}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>
        {streak.longest > streak.current && (
          <Text style={styles.longestStreak}>
            Best: {streak.longest} days
          </Text>
        )}
        {streak.is_active_today && (
          <View style={styles.activeToday}>
            <Text style={styles.activeTodayText}>✓ Active today</Text>
          </View>
        )}
      </View>

      {/* Earned Badges */}
      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earned Badges ({badges.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.badgesRow}>
              {badges.map((badge, index) => (
                <BadgeItem
                  key={`${badge.type}-${badge.tier}-${index}`}
                  badge={badge}
                  onPress={onBadgePress ? () => onBadgePress(badge) : undefined}
                  showProgress={showProgress}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Next Badge Progress */}
      {nextBadge && (
        <View style={styles.nextBadgeSection}>
          <Text style={styles.sectionTitle}>Next Badge</Text>
          <View style={styles.nextBadgeCard}>
            <View style={styles.nextBadgeHeader}>
              <Text style={styles.nextBadgeEmoji}>
                {BADGE_DISPLAY_INFO[nextBadge.type].icon}
              </Text>
              <View style={styles.nextBadgeInfo}>
                <Text style={styles.nextBadgeName}>{nextBadge.name}</Text>
                <Text style={styles.nextBadgeTier}>
                  {nextBadge.tier.charAt(0).toUpperCase() + nextBadge.tier.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.nextBadgeProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${nextBadge.progress || 0}%`,
                      backgroundColor: TIER_COLORS[nextBadge.tier],
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {nextBadge.progress?.toFixed(0)}% complete
              </Text>
            </View>
            <Text style={styles.nextBadgeDesc}>{nextBadge.description}</Text>
          </View>
        </View>
      )}

      {/* Locked Badges Preview */}
      {badges.length < allBadgeTypes.length * 3 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keep Going!</Text>
          <Text style={styles.lockedHint}>
            {allBadgeTypes.length * 3 - badges.length} more badges to unlock
          </Text>
          <View style={styles.lockedBadgesRow}>
            {allBadgeTypes
              .filter(type => !earnedTypes.has(type))
              .slice(0, 4)
              .map((type) => (
                <LockedBadge key={type} type={type} />
              ))}
          </View>
        </View>
      )}

      {/* Motivational Message */}
      <View style={styles.motivationSection}>
        {badges.length === 0 ? (
          <Text style={styles.motivationText}>
            Make your first recipe to start earning badges! 🌟
          </Text>
        ) : badges.length < 3 ? (
          <Text style={styles.motivationText}>
            Great start! Keep making recipes to earn more badges! 💪
          </Text>
        ) : (
          <Text style={styles.motivationText}>
            You're on fire! {badges.length} badges and counting! 🏆
          </Text>
        )}
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
  streakSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  streakInfo: {
    alignItems: 'flex-start',
  },
  streakNumber: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text,
    lineHeight: 36,
  },
  streakLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  longestStreak: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  activeToday: {
    backgroundColor: theme.colors.success + '30',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.sm,
  },
  activeTodayText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    paddingRight: theme.spacing.md,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    width: 72,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: theme.spacing.xs,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  tierBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surfaceSolid,
  },
  tierText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: '#000',
  },
  badgeName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    textAlign: 'center',
  },
  miniProgress: {
    width: 48,
    height: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  lockedBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  lockedBadgeItem: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    opacity: 0.5,
  },
  lockedBadgeIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockedEmoji: {
    fontSize: 20,
    opacity: 0.3,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },
  lockedProgress: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  lockedHint: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  nextBadgeSection: {
    marginBottom: theme.spacing.xl,
  },
  nextBadgeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  nextBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  nextBadgeEmoji: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  nextBadgeInfo: {
    flex: 1,
  },
  nextBadgeName: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  nextBadgeTier: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  nextBadgeProgress: {
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'right',
  },
  nextBadgeDesc: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  motivationSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  motivationText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default BadgeDisplay;
