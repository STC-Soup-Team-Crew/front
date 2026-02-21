/**
 * SearchScreen — Search recipes by ingredients
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../theme';
import { apiService } from '../services/apiService';

interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
  time?: number;
}

export const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const addTag = () => {
    const trimmed = query.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setQuery('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSearch = async () => {
    const allIngredients = [
      ...tags,
      ...(query.trim() ? [query.trim()] : []),
    ];
    if (allIngredients.length === 0) return;

    setLoading(true);
    setSearched(true);
    setQuery('');
    try {
      const recipes = await apiService.searchRecipesByIngredients(allIngredients);
      setResults(recipes);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Recipe', { recipe: item })}
      activeOpacity={0.75}
    >
      <View style={styles.cardContent}>
        <Text style={styles.recipeName}>{item.name}</Text>
        {item.time != null && (
          <Text style={styles.recipeTime}>{item.time} min</Text>
        )}
        <Text style={styles.ingredientPreview} numberOfLines={2}>
          {item.ingredients.slice(0, 4).join(', ')}
          {item.ingredients.length > 4 ? ` +${item.ingredients.length - 4} more` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search Recipes</Text>
          <Text style={styles.subtitle}>
            Search by recipe name or ingredient
          </Text>
        </View>

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. chicken, pasta, tacos..."
            placeholderTextColor={theme.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={addTag}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTag} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.tag}
                onPress={() => removeTag(tag)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagText}>{tag} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search button */}
        <TouchableOpacity
          style={[
            styles.searchBtn,
            (tags.length === 0 && !query.trim()) && styles.searchBtnDisabled,
          ]}
          onPress={handleSearch}
          activeOpacity={0.85}
          disabled={tags.length === 0 && !query.trim()}
        >
          <Text style={styles.searchBtnText}>Search Recipes</Text>
        </TouchableOpacity>

        {/* Results */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.button} />
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderResult}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              searched ? (
                <View style={styles.centered}>
                  <Text style={styles.emptyTitle}>No recipes found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try different ingredients
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inner: {
    flex: 1,
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    ...theme.shadow.sm,
  },
  addBtn: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    ...theme.shadow.sm,
  },
  addBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.button,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tag: {
    backgroundColor: theme.colors.button,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  tagText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.buttonText,
  },
  searchBtn: {
    backgroundColor: theme.colors.button,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadow.md,
  },
  searchBtnDisabled: {
    opacity: 0.45,
  },
  searchBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.buttonText,
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
    ...theme.shadow.sm,
  },
  cardContent: {
    flex: 1,
  },
  recipeName: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recipeTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  ingredientPreview: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
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
  },
});
