/**
 * ErrorModal Component
 * Displays error messages with retry or dismiss options
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../theme';

interface ErrorModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  title = 'Oops! Something went wrong',
  message,
  onDismiss,
  onRetry,
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
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.title, { fontWeight: '700' as any }]}>{title}</Text>
          <Text style={[styles.message, { fontWeight: '400' as any }]}>{message}</Text>

          <View style={styles.buttonContainer}>
            {onRetry && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={onRetry}
              >
                <Text style={styles.retryButtonText}>🔄 Retry</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.dismissButton]}
              onPress={onDismiss}
            >
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    maxWidth: '85%',
    ...theme.shadow.lg,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  buttonContainer: {
    gap: theme.spacing.md,
    width: '100%',
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dismissButton: {
    backgroundColor: theme.colors.lightGray,
  },
  dismissButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
