/**
 * ImpactCard Component
 * 
 * Displays environmental impact metrics in a visually appealing card.
 * Shows food waste prevented, money saved, and CO2 emissions avoided.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { theme } from '../../theme';
import { ImpactTotals, ImpactSource, IngredientImpact } from '../../types/impact';

interface ImpactCardProps {
  totals: ImpactTotals;
  source?: ImpactSource;
  showBreakdown?: boolean;
  breakdown?: IngredientImpact[];
  onClose?: () => void;
  animated?: boolean;
  isModal?: boolean;
}

interface StatBoxProps {
  icon: string;
  value: number;
  unit: string;
  label: string;
  color: string;
  animated?: boolean;
  delay?: number;
}

const StatBox: React.FC<StatBoxProps> = ({
  icon,
  value,
  unit,
  label,
  color,
  animated = false,
  delay = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(animated ? 0 : value);

  useEffect(() => {
    if (animated) {
      // Scale in animation
      Animated.sequence([
        Animated.delay(delay),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Count up animation
      const timer = setTimeout(() => {
        let start = 0;
        const duration = 1000;
        const increment = value / (duration / 16);
        const interval = setInterval(() => {
          start += increment;
          if (start >= value) {
            setDisplayValue(value);
            clearInterval(interval);
          } else {
            setDisplayValue(Math.round(start * 100) / 100);
          }
        }, 16);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [animated, value, delay]);

  return (
    <Animated.View
      style={[
        styles.statBox,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>
        {displayValue.toFixed(value < 10 ? 2 : 1)}
        <Text style={styles.statUnit}> {unit}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

const ImpactCard: React.FC<ImpactCardProps> = ({
  totals,
  source,
  showBreakdown = false,
  breakdown,
  onClose,
  animated = true,
  isModal = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const getSourceMessage = () => {
    switch (source) {
      case 'recipe':
        return 'By making this recipe, you just saved:';
      case 'fridge_share':
        return 'By sharing food, you helped save:';
      case 'manual':
        return 'You logged an impact of:';
      default:
        return 'Your environmental impact:';
    }
  };

  const cardContent = (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.celebrationEmoji}>🌱</Text>
        <Text style={styles.headerText}>{getSourceMessage()}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatBox
          icon="🥬"
          value={totals.waste_prevented_kg}
          unit="kg"
          label="Food Saved"
          color="#4CAF50"
          animated={animated}
          delay={0}
        />
        <StatBox
          icon="💰"
          value={totals.money_saved_usd}
          unit="$"
          label="Money Saved"
          color="#FFC107"
          animated={animated}
          delay={150}
        />
        <StatBox
          icon="🌍"
          value={totals.co2_avoided_kg}
          unit="kg"
          label="CO₂ Avoided"
          color="#2196F3"
          animated={animated}
          delay={300}
        />
      </View>

      {/* Breakdown Section */}
      {showBreakdown && breakdown && breakdown.length > 0 && (
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Breakdown</Text>
          {breakdown.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownName}>
                {item.name} ({item.quantity} {item.unit})
              </Text>
              <Text style={styles.breakdownValue}>
                {item.weight_kg.toFixed(2)}kg · ${item.cost_usd.toFixed(2)}
              </Text>
            </View>
          ))}
          {breakdown.length > 5 && (
            <Text style={styles.moreItems}>
              +{breakdown.length - 5} more items
            </Text>
          )}
        </View>
      )}

      {/* Motivational Message */}
      <View style={styles.motivationContainer}>
        <Text style={styles.motivationText}>
          Small actions, big impact! 🌟
        </Text>
      </View>

      {/* Close Button (if modal) */}
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Awesome!</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  if (isModal) {
    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          {cardContent}
        </View>
      </Modal>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 360,
    ...theme.shadow.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  headerText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    marginBottom: 2,
  },
  statUnit: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  breakdownSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  breakdownTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  breakdownName: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  breakdownValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  moreItems: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  motivationContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  motivationText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  closeButton: {
    backgroundColor: theme.colors.button,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.buttonText,
  },
});

export default ImpactCard;
