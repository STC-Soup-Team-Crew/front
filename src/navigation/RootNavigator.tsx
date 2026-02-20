/**
 * Navigation Stack Configuration
 * Handles navigation between HomeScreen, CameraScreen, and RecipeScreen
 */

import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { RecipeScreen } from '../screens/RecipeScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: '600' as any,
            fontSize: 18,
          },
        } as any}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
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
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
};
