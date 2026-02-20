/**
 * ProfileScreen — User info + logout
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() || 'G';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        {/* Name */}
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>

        {/* Email or Guest badge */}
        {user?.mode === 'registered' && user.email ? (
          <Text style={styles.email}>{user.email}</Text>
        ) : (
          <View style={styles.guestBadge}>
            <Text style={styles.guestBadgeText}>Guest Account</Text>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.button,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 42,
    color: theme.colors.buttonText,
  },
  name: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['2xl'],
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xxl,
  },
  guestBadge: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.xxl,
  },
  guestBadgeText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  logoutBtn: {
    backgroundColor: theme.colors.button,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadow.md,
  },
  logoutBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.buttonText,
  },
});
