/**
 * FridgeShareFeedScreen — Community feed of leftover fridge items
 * Users can browse available items and claim them to reduce food waste
 */

import React, { useState, useCallback } from 'react';
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
import { colors } from '../theme/colors';
import { apiService, FridgeListing } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

export const FridgeShareFeedScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState<FridgeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      const data = await apiService.getFridgeListings('available');
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch fridge listings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Re-fetch every time the tab gains focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchListings();
    });
    return unsubscribe;
  }, [navigation, fetchListings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  const getTimeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const renderItem = ({ item }: { item: FridgeListing }) => {
    const isOwn = user?.id === item.user_id;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ItemDetail', { listing: item })}
      >
        {/* Header row */}
        <View style={styles.cardHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {item.user_display_name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
            <Text style={styles.posterName} numberOfLines={1}>
              {isOwn ? 'You' : item.user_display_name}
            </Text>
            <Text style={styles.timeAgo}>{getTimeAgo(item.created_at)}</Text>
          </View>
          {item.expiry_hint ? (
            <View style={styles.expiryBadge}>
              <Text style={styles.expiryText}>⏳ {item.expiry_hint}</Text>
            </View>
          ) : null}
        </View>

        {/* Title */}
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

        {/* Items preview */}
        <View style={styles.itemsRow}>
          {item.items.slice(0, 4).map((itm, idx) => (
            <View key={idx} style={styles.itemChip}>
              <Text style={styles.itemChipText} numberOfLines={1}>{itm}</Text>
            </View>
          ))}
          {item.items.length > 4 && (
            <View style={styles.itemChip}>
              <Text style={styles.itemChipText}>+{item.items.length - 4}</Text>
            </View>
          )}
        </View>

        {/* Quantity / description preview */}
        {item.quantity ? (
          <Text style={styles.quantity}>📦 {item.quantity}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🍎</Text>
      <Text style={styles.emptyTitle}>No Leftovers Yet</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to share something from your fridge!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Fridge Share</Text>
          <Text style={styles.screenSubtitle}>
            Share leftovers, reduce waste 🌱
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
          <Text style={styles.loadingText}>Loading community items...</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.text}
            />
          }
        />
      )}

      {/* Floating "Post" button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PostItem')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  screenTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: colors.text,
  },
  screenSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  /* ----- Card ----- */
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
    color: colors.buttonText,
  },
  posterName: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: colors.text,
  },
  timeAgo: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: colors.textMuted,
  },
  expiryBadge: {
    backgroundColor: 'rgba(240, 192, 64, 0.25)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.md,
  },
  expiryText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: colors.warning,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  itemChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  itemChipText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: colors.text,
  },
  quantity: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: colors.textMuted,
  },
  /* ----- Empty state ----- */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  /* ----- FAB ----- */
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.lg,
  },
  fabText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 30,
    color: colors.buttonText,
    marginTop: -2,
  },
});
