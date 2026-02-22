/**
 * DashboardScreen — Home tab with top recipe card, grocery list, scan CTA
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

interface GroceryItem {
  id: string;
  name: string;
}

interface Recipe {
  name: string;
  subtitle: string;
}

interface DashboardScreenProps {
  navigation: any;
}

const STORAGE_KEY = '@grocery_list';

const PLACEHOLDER_ITEMS: GroceryItem[] = [
  { id: '1', name: 'Carrots' },
  { id: '2', name: 'Milk' },
  { id: '3', name: 'Cookies' },
];

const RECOMMENDED_RECIPES: Recipe[] = [
  { name: 'Creamy Pasta', subtitle: 'A quick 15-minute meal with what you have.' },
  { name: 'Fresh Garden Salad', subtitle: 'Light and refreshing for a healthy lunch.' },
  { name: 'Veggie Stir Fry', subtitle: 'Toss your favorite vegetables in a savory sauce.' },
  { name: 'Hearty Tomato Soup', subtitle: 'Comforting soup perfect for a chilly day.' },
  { name: 'Avocado Toast', subtitle: 'Simple, trendy, and delicious breakfast.' },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [randomRecipe, setRandomRecipe] = useState<Recipe>(RECOMMENDED_RECIPES[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load grocery list on mount
  useEffect(() => {
    const loadGroceryList = async () => {
      try {
        const savedList = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedList !== null) {
          setGroceryList(JSON.parse(savedList));
        } else {
          setGroceryList(PLACEHOLDER_ITEMS);
        }
      } catch (e) {
        console.error('Failed to load grocery list', e);
        setGroceryList(PLACEHOLDER_ITEMS);
      } finally {
        setIsLoaded(true);
      }
    };

    loadGroceryList();

    const randomIndex = Math.floor(Math.random() * RECOMMENDED_RECIPES.length);
    setRandomRecipe(RECOMMENDED_RECIPES[randomIndex]);
  }, []);

  // Save grocery list whenever it changes
  useEffect(() => {
    const saveGroceryList = async () => {
      if (!isLoaded) return;
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groceryList));
      } catch (e) {
        console.error('Failed to save grocery list', e);
      }
    };

    saveGroceryList();
  }, [groceryList, isLoaded]);

  const addGroceryItem = () => {
    const newId = String(Date.now());
    setGroceryList((prev) => [...prev, { id: newId, name: '' }]);
  };

  const updateGroceryItem = (id: string, newName: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const removeGroceryItem = (id: string) => {
    setGroceryList((prev) => prev.filter((item) => item.id !== id));
  };

  const renderGroceryItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.groceryRow}>
      <View style={styles.bullet} />
      <TextInput
        style={styles.groceryText}
        value={item.name}
        onChangeText={(text) => updateGroceryItem(item.id, text)}
        placeholder="Type item..."
        placeholderTextColor={theme.colors.textMuted}
      />
      <TouchableOpacity onPress={() => removeGroceryItem(item.id)} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>✕</Text>
      </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>Top Recipe</Text>
        <View style={styles.recipeCardContent}>
          <Text style={styles.recipeCardTitle}>{randomRecipe.name}</Text>
          <Text style={styles.recipeCardSubtitle}>
            {randomRecipe.subtitle}
          </Text>
        </View>
      </View>

      {/* Grocery List Section */}
      <View style={styles.grocerySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Grocery List</Text>
          <TouchableOpacity onPress={addGroceryItem} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={groceryList}
          renderItem={renderGroceryItem}
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
  recipeCardContent: {
    marginTop: theme.spacing.sm,
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
  grocerySection: {
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
  groceryRow: {
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
  groceryText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    padding: 0, // for Android
  },
  removeBtn: {
    padding: theme.spacing.xs,
  },
  removeBtnText: {
    color: theme.colors.textMuted,
    fontSize: 14,
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
