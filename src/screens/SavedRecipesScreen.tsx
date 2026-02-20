/**
 * SavedRecipesScreen — Starred / saved recipes list
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';

interface SavedRecipe {
  id: string;
  name: string;
  time: string;
  starred: boolean;
}

const PLACEHOLDER_SAVED: SavedRecipe[] = [
  { id: '1', name: 'Veggie Stir Fry', time: '25 min', starred: true },
  { id: '2', name: 'Pasta Primavera', time: '30 min', starred: true },
];

export const SavedRecipesScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>(PLACEHOLDER_SAVED);

  const toggleStar = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r))
    );
  };

  const renderItem = ({ item }: { item: SavedRecipe }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeTime}>{item.time}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleStar(item.id)} style={styles.starBtn}>
        <Text style={styles.starText}>{item.starred ? '\u2605' : '\u2606'}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No saved recipes yet</Text>
      <Text style={styles.emptySubtitle}>
        Star a recipe to save it here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text,
  },
  list: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  cardContent: {
    flex: 1,
  },
  recipeName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recipeTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  starBtn: {
    padding: theme.spacing.sm,
  },
  starText: {
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
