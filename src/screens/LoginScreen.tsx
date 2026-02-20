/**
 * LoginScreen — Meal Master branding, Clerk scaffolding + guest
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, continueAsGuest } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    await signIn(email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Branding */}
          <View style={styles.header}>
            <Text style={styles.brand}>Meal Master</Text>
            <Text style={styles.subtitle}>Reduce waste. Eat well.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Guest */}
          <TouchableOpacity style={styles.guestLink} onPress={continueAsGuest}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  brand: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 42,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
  },
  form: {
    gap: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  loginButton: {
    backgroundColor: theme.colors.button,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    ...theme.shadow.md,
  },
  loginButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.buttonText,
  },
  signUpButton: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  guestLink: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  guestText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textDecorationLine: 'underline',
  },
});
