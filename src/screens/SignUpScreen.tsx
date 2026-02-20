/**
 * SignUpScreen — Clerk auth scaffolding
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

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    await signUp(name, email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Meal Master today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

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

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['4xl'],
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
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
  signUpButton: {
    backgroundColor: theme.colors.button,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    ...theme.shadow.md,
  },
  signUpButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.buttonText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xxl,
  },
  footerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  footerLink: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
});
