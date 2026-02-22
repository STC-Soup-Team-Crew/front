/**
 * PostItemScreen — Form to share leftover fridge items with the community
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';
import { colors } from '../theme/colors';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

export const PostItemScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentItem, setCurrentItem] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [quantity, setQuantity] = useState('');
  const [expiryHint, setExpiryHint] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    const trimmed = currentItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
      setCurrentItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in to share items.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Missing title', 'Give your listing a title.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('No items', 'Add at least one item you want to share.');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.createFridgeListing({
        user_id: user.id,
        user_display_name: user.name,
        title: title.trim(),
        description: description.trim() || undefined,
        items,
        quantity: quantity.trim() || undefined,
        expiry_hint: expiryHint.trim() || undefined,
        pickup_instructions: pickupInstructions.trim() || undefined,
      });
      Alert.alert('Shared! 🎉', 'Your items are now visible to the community.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.screenTitle}>Share Leftovers</Text>
            <Text style={styles.screenSubtitle}>
              List items from your fridge for others to pick up
            </Text>
          </View>

          {/* Title field */}
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Fresh veggies — must go today!"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Any extra details about the items..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          {/* Items — tag-style input */}
          <Text style={styles.label}>Items *</Text>
          <View style={styles.itemInputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={currentItem}
              onChangeText={setCurrentItem}
              placeholder="e.g. 3 tomatoes"
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={addItem}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          {items.length > 0 && (
            <View style={styles.chipsContainer}>
              {items.map((itm, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chip}
                  onPress={() => removeItem(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{itm}  ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quantity */}
          <Text style={styles.label}>Quantity / Portion</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="e.g. Enough for 2 meals"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />

          {/* Expiry hint */}
          <Text style={styles.label}>Expiry Hint</Text>
          <TextInput
            style={styles.input}
            value={expiryHint}
            onChangeText={setExpiryHint}
            placeholder="e.g. Use within 2 days"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />

          {/* Pickup instructions */}
          <Text style={styles.label}>Pickup Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={pickupInstructions}
            onChangeText={setPickupInstructions}
            placeholder="e.g. I'm in Building A, lobby drop-off"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={2}
            maxLength={300}
          />

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={styles.submitBtnText}>Share with Community 🌱</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  screenTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['2xl'],
    color: colors.text,
  },
  screenSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 4,
  },
  label: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  itemInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  addBtn: {
    backgroundColor: colors.button,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  addBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: colors.buttonText,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.xl,
  },
  chipText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: colors.text,
  },
  submitBtn: {
    backgroundColor: colors.button,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    ...theme.shadow.md,
  },
  submitBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
    color: colors.buttonText,
  },
});
