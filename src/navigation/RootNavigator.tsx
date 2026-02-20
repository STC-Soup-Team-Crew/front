/**
 * RootNavigator V3 — Auth-aware, delegates to MainTabNavigator
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@clerk/clerk-expo';
import { theme } from '../theme';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.text} />
      </View>
    );
  }

  return (
    <NavigationIndependentTree>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        } as any}
      >
        {isSignedIn ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen as any}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen as any}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
};
