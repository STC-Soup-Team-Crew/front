/**
 * SavedRecipesScreen — Starred / saved recipes list
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { theme } from '../theme';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

interface SavedRecipe {
  id: string;
  name: string;
  time: string;
  starred: boolean;
  ingredients?: string[];
  steps?: string[];
}

export const SavedRecipesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const favorites = await apiService.getFavorites(user.id);
      
      const mappedRecipes: SavedRecipe[] = favorites.map((f, index) => ({
        id: String(index), // Using index since ID is not returned from API
        name: f.name,
        time: f.time ? `${f.time} min` : 'N/A',
        starred: true,
        ingredients: f.ingredients,
        steps: f.steps,
      }));
      
      setRecipes(mappedRecipes);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });
    return unsubscribe;
  }, [navigation, fetchFavorites]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const toggleStar = (id: string) => {
    // Note: This only toggles local state in this version.
    // In a full implementation, you'd call a 'unfavorite' API.
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r))
    );
  };

  const handleRecipePress = (item: SavedRecipe) => {
    navigation.navigate('Recipe', {
      recipe: {
        name: item.name,
        ingredients: item.ingredients || [],
        steps: item.steps || [],
        time: parseInt(item.time.replace(/[^0-9]/g, ''), 10) || 0,
      },
    });
  };

  const renderItem = ({ item }: { item: SavedRecipe }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleRecipePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeTime}>{item.time}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleStar(item.id)} style={styles.starBtn}>
        <Text style={styles.starText}>{item.starred ? '\u2605' : '\u2606'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>
        {loading ? 'Fetching favorites...' : 'No saved recipes yet'}
      </Text>
      {!loading && (
        <Text style={styles.emptySubtitle}>
          Star a recipe to save it here
        </Text>
      )}
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Not logged in</Text>
          <Text style={styles.emptySubtitle}>
            Please log in to view your favorite recipes
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.button} />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.button}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
