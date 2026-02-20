/**
 * CreateRecipeScreen — Form to create a recipe and POST to API
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../theme';
import { apiService } from '../services/apiService';

export const CreateRecipeScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => setIngredients((prev) => [...prev, '']);
  const removeIngredient = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) =>
    setIngredients((prev) => prev.map((v, i) => (i === index ? value : v)));

  const addStep = () => setSteps((prev) => [...prev, '']);
  const removeStep = (index: number) =>
    setSteps((prev) => prev.filter((_, i) => i !== index));
  const updateStep = (index: number, value: string) =>
    setSteps((prev) => prev.map((v, i) => (i === index ? value : v)));

  const handleSubmit = async () => {
    const cleanIngredients = ingredients.filter((i) => i.trim() !== '');
    const cleanSteps = steps.filter((s) => s.trim() !== '');

    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter a recipe name.');
      return;
    }
    if (cleanIngredients.length === 0) {
      Alert.alert('Missing Info', 'Add at least one ingredient.');
      return;
    }
    if (cleanSteps.length === 0) {
      Alert.alert('Missing Info', 'Add at least one step.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createRecipe({
        name: name.trim(),
        time: time.trim(),
        ingredients: cleanIngredients,
        steps: cleanSteps,
      });
      Alert.alert('Success', 'Recipe created!');
      setName('');
      setTime('');
      setIngredients(['']);
      setSteps(['']);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create recipe'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Recipe</Text>
          </View>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Recipe Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Veggie Stir Fry"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Time */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Prep Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 25 min"
              placeholderTextColor={theme.colors.textMuted}
              value={time}
              onChangeText={setTime}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ingredients</Text>
            {ingredients.map((ing, index) => (
              <View key={`ing-${index}`} style={styles.dynamicRow}>
                <TextInput
                  style={[styles.input, styles.dynamicInput]}
                  placeholder={`Ingredient ${index + 1}`}
                  placeholderTextColor={theme.colors.textMuted}
                  value={ing}
                  onChangeText={(val) => updateIngredient(index, val)}
                />
                {ingredients.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeIngredient(index)}
                  >
                    <Text style={styles.removeBtnText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addRowBtn} onPress={addIngredient}>
              <Text style={styles.addRowBtnText}>+ Add Ingredient</Text>
            </TouchableOpacity>
          </View>

          {/* Steps */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Steps</Text>
            {steps.map((step, index) => (
              <View key={`step-${index}`} style={styles.dynamicRow}>
                <TextInput
                  style={[styles.input, styles.dynamicInput]}
                  placeholder={`Step ${index + 1}`}
                  placeholderTextColor={theme.colors.textMuted}
                  value={step}
                  onChangeText={(val) => updateStep(index, val)}
                  multiline
                />
                {steps.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeStep(index)}
                  >
                    <Text style={styles.removeBtnText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addRowBtn} onPress={addStep}>
              <Text style={styles.addRowBtnText}>+ Add Step</Text>
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting ? 'Saving...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text,
  },
  fieldGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dynamicInput: {
    flex: 1,
  },
  removeBtn: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  addRowBtn: {
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  addRowBtnText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.buttonText,
  },
  submitBtn: {
    backgroundColor: theme.colors.button,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    ...theme.shadow.md,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.buttonText,
  },
});
