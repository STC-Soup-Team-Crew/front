/**
 * Navigation Stack Configuration V2
 * Auth-aware navigation with Dashboard as main hub
 */

import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { RecipeScreen } from '../screens/RecipeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

// Toggle this flag to switch between auth and main flows
const isAuthenticated = true;

export const RootNavigator: React.FC = () => {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontFamily: theme.typography.fontFamily.semibold,
            fontSize: 18,
          } as any,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        } as any}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Camera"
              component={CameraScreen as any}
              options={{
                headerTitle: 'Capture Your Fridge',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="Recipe"
              component={RecipeScreen as any}
              options={{
                headerTitle: 'Your Recipe',
                headerBackTitle: 'Back',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen as any}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen as any}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
};
