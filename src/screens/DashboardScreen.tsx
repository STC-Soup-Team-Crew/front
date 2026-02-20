/**
 * DashboardScreen — Home tab with top recipe card, ingredients list, scan CTA
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

interface Ingredient {
  id: string;
  name: string;
}

interface DashboardScreenProps {
  navigation: any;
}

const PLACEHOLDER_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Carrots' },
  { id: '2', name: 'Milk' },
  { id: '3', name: 'Cookies' },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(PLACEHOLDER_INGREDIENTS);

  const addIngredient = () => {
    const newId = String(Date.now());
    setIngredients((prev) => [...prev, { id: newId, name: 'New item' }]);
  };

  const renderIngredient = ({ item }: { item: Ingredient }) => (
    <View style={styles.ingredientRow}>
      <View style={styles.bullet} />
      <Text style={styles.ingredientText}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Meal Master</Text>
        <Text style={styles.greeting}>What will you cook today?</Text>
      </View>

      {/* Top Recipe Card */}
      <View style={styles.recipeCard}>
        <Text style={styles.recipeCardTitle}>Top Recipe</Text>
        <Text style={styles.recipeCardSubtitle}>
          Scan your fridge to get a personalized suggestion
        </Text>
      </View>

      {/* Ingredients Section */}
      <View style={styles.ingredientsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Ingredients</Text>
          <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={ingredients}
          renderItem={renderIngredient}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Scan CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate('Camera')}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaButtonText}>Scan My Fridge</Text>
      </TouchableOpacity>
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
  recipeCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.sm,
  },
  recipeCardTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recipeCardSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  ingredientsSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    color: theme.colors.buttonText,
    lineHeight: 24,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text,
    marginRight: theme.spacing.md,
  },
  ingredientText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
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
});
