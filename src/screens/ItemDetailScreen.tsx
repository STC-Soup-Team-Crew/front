/**
 * ItemDetailScreen — Full view of a single fridge listing with claim functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { theme } from '../theme';
import { colors } from '../theme/colors';
import { apiService, FridgeListing } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

interface RouteParams {
  listing: FridgeListing;
}

export const ItemDetailScreen: React.FC<{ navigation: any; route: { params: RouteParams } }> = ({
  navigation,
  route,
}) => {
  const { user } = useAuth();
  const [listing, setListing] = useState<FridgeListing>(route.params.listing);
  const [claiming, setClaiming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.id === listing.user_id;
  const isClaimed = listing.status === 'claimed';
  const isAvailable = listing.status === 'available';

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

  const handleClaim = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in to claim items.');
      return;
    }

    Alert.alert(
      'Claim This Item?',
      `You'll be connected with ${listing.user_display_name} to arrange pickup.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: async () => {
            setClaiming(true);
            try {
              const updated = await apiService.claimFridgeListing(listing.id, user.id, user.name);
              setListing(updated);
              Alert.alert('Claimed! 🎉', 'This item is now reserved for you. Coordinate pickup with the poster.');
            } catch (error: any) {
              Alert.alert('Oops', error.message || 'Could not claim this listing.');
            } finally {
              setClaiming(false);
            }
          },
        },
      ],
    );
  };

  const handleDelete = async () => {
    if (!user) return;

    Alert.alert('Remove Listing?', 'This listing will be removed from the feed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await apiService.deleteFridgeListing(listing.id, user.id);
            Alert.alert('Removed', 'Listing deleted.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not delete listing.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  const handleShare = async () => {
    const message = [
      `🍎 ${listing.title}`,
      '',
      `Items: ${listing.items.join(', ')}`,
      listing.quantity ? `Quantity: ${listing.quantity}` : '',
      listing.expiry_hint ? `Expiry: ${listing.expiry_hint}` : '',
      listing.pickup_instructions ? `Pickup: ${listing.pickup_instructions}` : '',
      '',
      `Shared via Meal Maker 🌱`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await Share.share({ message });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status banner */}
        {isClaimed && (
          <View style={styles.claimedBanner}>
            <Text style={styles.claimedBannerText}>
              ✅ Claimed{listing.claimed_by_name ? ` by ${isOwner ? listing.claimed_by_name : 'you'}` : ''}
            </Text>
          </View>
        )}

        {/* Poster info */}
        <View style={styles.posterRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {listing.user_display_name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
            <Text style={styles.posterName}>
              {isOwner ? 'You' : listing.user_display_name}
            </Text>
            <Text style={styles.timeAgo}>Posted {getTimeAgo(listing.created_at)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{listing.title}</Text>

        {/* Description */}
        {listing.description ? (
          <Text style={styles.description}>{listing.description}</Text>
        ) : null}

        {/* Items */}
        <Text style={styles.sectionTitle}>Items Available</Text>
        <View style={styles.itemsList}>
          {listing.items.map((itm, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.itemText}>{itm}</Text>
            </View>
          ))}
        </View>

        {/* Details cards */}
        <View style={styles.detailsGrid}>
          {listing.quantity ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>📦</Text>
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>{listing.quantity}</Text>
            </View>
          ) : null}
          {listing.expiry_hint ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>⏳</Text>
              <Text style={styles.detailLabel}>Expiry</Text>
              <Text style={styles.detailValue}>{listing.expiry_hint}</Text>
            </View>
          ) : null}
        </View>

        {/* Pickup instructions */}
        {listing.pickup_instructions ? (
          <>
            <Text style={styles.sectionTitle}>Pickup Instructions</Text>
            <View style={styles.pickupCard}>
              <Text style={styles.pickupText}>📍 {listing.pickup_instructions}</Text>
            </View>
          </>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          {isAvailable && !isOwner && (
            <TouchableOpacity
              style={styles.claimBtn}
              onPress={handleClaim}
              disabled={claiming}
              activeOpacity={0.8}
            >
              {claiming ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={styles.claimBtnText}>🤝 Claim This Item</Text>
              )}
            </TouchableOpacity>
          )}

          {isOwner && isAvailable && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              disabled={deleting}
              activeOpacity={0.8}
            >
              {deleting ? (
                <ActivityIndicator color={colors.error} />
              ) : (
                <Text style={styles.deleteBtnText}>Remove Listing</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Text style={styles.shareBtnText}>Share 📤</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  /* Status banner */
  claimedBanner: {
    backgroundColor: 'rgba(168, 216, 78, 0.2)',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  claimedBannerText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: colors.success,
  },
  /* Poster row */
  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    color: colors.buttonText,
  },
  posterName: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: colors.text,
  },
  timeAgo: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  /* Content */
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['2xl'],
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  itemsList: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
    color: colors.success,
    marginRight: theme.spacing.sm,
    lineHeight: 22,
  },
  itemText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  /* Detail cards */
  detailsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  detailCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: colors.text,
    textAlign: 'center',
  },
  /* Pickup */
  pickupCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  pickupText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: colors.text,
    lineHeight: 22,
  },
  /* Actions */
  actions: {
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  claimBtn: {
    backgroundColor: colors.button,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadow.md,
  },
  claimBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
    color: colors.buttonText,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: colors.error,
  },
  shareBtn: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  shareBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: colors.text,
  },
});
