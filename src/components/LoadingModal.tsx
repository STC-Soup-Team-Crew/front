/**
 * LoadingModal Component V2
 * Loading spinner — no emojis, Poppins font, new palette
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
            color={theme.colors.button}
            style={styles.spinner}
          />
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subtext}>This may take a moment...</Text>
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
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadow.lg,
  },
  spinner: {
    marginBottom: theme.spacing.lg,
  },
  message: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
