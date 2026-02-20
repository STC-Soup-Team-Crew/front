/**
 * ErrorModal Component V2
 * Error display with retry/dismiss — no emojis, Poppins font, new palette
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
  title = 'Something went wrong',
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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {onRetry && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={onRetry}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
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
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    maxWidth: '85%',
    ...theme.shadow.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: 24,
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
    backgroundColor: theme.colors.button,
  },
  retryButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.buttonText,
    fontSize: theme.typography.fontSize.base,
  },
  dismissButton: {
    backgroundColor: theme.colors.surface,
  },
  dismissButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
  },
});
