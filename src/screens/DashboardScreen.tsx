/**
 * DashboardScreen Component
 * Main hub: saved/starred recipes + "Check My Fridge" button
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';

interface SavedRecipe {
  id: string;
  name: string;
  date: string;
  starred: boolean;
}

interface DashboardScreenProps {
  navigation: any;
}

// Placeholder saved recipes for UI scaffolding
const PLACEHOLDER_RECIPES: SavedRecipe[] = [];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [savedRecipes] = useState<SavedRecipe[]>(PLACEHOLDER_RECIPES);

  const renderRecipeCard = ({ item }: { item: SavedRecipe }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <View style={styles.recipeCardContent}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeDate}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.starButton}>
        <Text style={styles.starIcon}>{item.starred ? '\u2605' : '\u2606'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No saved recipes yet</Text>
      <Text style={styles.emptySubtitle}>
        Snap a photo of your fridge to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Meal Maker</Text>
        <Text style={styles.greeting}>What will you cook today?</Text>
      </View>

      {/* Main CTA — the ONLY button with emoji */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate('Camera')}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaButtonText}>Check My Fridge</Text>
      </TouchableOpacity>

      {/* Saved Recipes Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Saved Recipes</Text>

        <FlatList
          data={savedRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  appTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['4xl'],
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
  },
  ctaButton: {
    backgroundColor: theme.colors.button,
    marginHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadow.md,
  },
  ctaButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.buttonText,
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  recipeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  recipeCardContent: {
    flex: 1,
  },
  recipeName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recipeDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  starButton: {
    padding: theme.spacing.sm,
  },
  starIcon: {
    fontSize: 22,
    color: theme.colors.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
