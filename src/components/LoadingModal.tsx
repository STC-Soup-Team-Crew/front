/**
 * LoadingModal Component
 * Shows loading spinner while API request is processing
 */

import React from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  message = 'Processing your request...',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.spinner}
          />
          <Text style={[styles.message, { fontWeight: '500' as any }]}>{message}</Text>
          <Text style={[styles.subtext, { fontWeight: '400' as any }]}>This may take a moment...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadow.lg,
  },
  spinner: {
    marginBottom: theme.spacing.lg,
  },
  message: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
