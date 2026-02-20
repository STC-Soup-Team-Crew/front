/**
 * HomeScreen Component
 * Welcome screen with app introduction and quick start
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { theme } from '../theme';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with gradient effect */}
      <View style={styles.header}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.appTitle}>Meal Maker</Text>
        <Text style={styles.tagline}>Reduce Waste, Create Meals</Text>
      </View>

      {/* Introduction Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Welcome to Meal Maker</Text>
        <Text style={styles.description}>
          Stop wasting food and start creating delicious meals! Simply photograph your fridge or
          pantry, and our AI will suggest recipes based on what you have.
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.featureNumber}>
              <Text style={styles.featureNumberText}>1</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>📸 Capture</Text>
              <Text style={styles.featureDescription}>
                Take a photo of your fridge or pantry
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureNumber}>
              <Text style={styles.featureNumberText}>2</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>🤖 Analyze</Text>
              <Text style={styles.featureDescription}>
                Our AI identifies ingredients and available items
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureNumber}>
              <Text style={styles.featureNumberText}>3</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>🍳 Cook</Text>
              <Text style={styles.featureDescription}>
                Get a personalized recipe with step-by-step instructions
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Meal Maker?</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>♻️</Text>
            <Text style={styles.benefitText}>Reduce food waste and help the environment</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎯</Text>
            <Text style={styles.benefitText}>Get personalized recipes based on your inventory</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⏱️</Text>
            <Text style={styles.benefitText}>Save time deciding what to cook</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💰</Text>
            <Text style={styles.benefitText}>Make the most of your groceries</Text>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.primaryButtonText}>Get Started 🚀</Text>
        </TouchableOpacity>

        <Text style={styles.ctaSubtext}>
          Start by photographing your fridge or pantry to generate your first recipe!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  appTitle: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primaryLight,
    fontWeight: theme.typography.fontWeight.medium,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  featureList: {
    gap: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'flex-start',
    ...theme.shadow.sm,
  },
  featureNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  featureNumberText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.lg,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  benefitsList: {
    gap: theme.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  benefitText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    flex: 1,
  },
  ctaContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadow.md,
    marginBottom: theme.spacing.md,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  ctaSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
