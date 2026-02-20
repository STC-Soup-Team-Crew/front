/**
 * MainTabNavigator — Bottom tabs: Home | Saved | Create | Profile
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { colors } from '../theme/colors';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { RecipeScreen } from '../screens/RecipeScreen';
import { SavedRecipesScreen } from '../screens/SavedRecipesScreen';
import { CreateRecipeScreen } from '../screens/CreateRecipeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const defaultStackOptions = {
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.text,
  headerTitleStyle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 18,
  } as any,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: theme.colors.background },
} as any;

/* ---- Home stack: Dashboard -> Camera -> Recipe ---- */
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={defaultStackOptions}>
    <HomeStack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="Camera"
      component={CameraScreen as any}
      options={{ headerTitle: 'Scan Your Fridge', headerBackTitle: 'Back' }}
    />
    <HomeStack.Screen
      name="Recipe"
      component={RecipeScreen as any}
      options={{ headerTitle: 'Your Recipe', headerBackTitle: 'Back' }}
    />
  </HomeStack.Navigator>
);

/* ---- Tab icon (text-based, no emojis) ---- */
const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text
    style={[
      styles.tabIcon,
      { color: focused ? colors.tabBarActive : colors.tabBarInactive },
    ]}
  >
    {label}
  </Text>
);

/* ---- Main Tab Navigator ---- */
export const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.tabBarActive,
      tabBarInactiveTintColor: colors.tabBarInactive,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStackNavigator}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => <TabIcon label="H" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="SavedTab"
      component={SavedRecipesScreen}
      options={{
        tabBarLabel: 'Saved',
        tabBarIcon: ({ focused }) => <TabIcon label="S" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="CreateTab"
      component={CreateRecipeScreen}
      options={{
        tabBarLabel: 'Create',
        tabBarIcon: ({ focused }) => <TabIcon label="+" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => <TabIcon label="P" focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBarBackground,
    borderTopWidth: 0,
    elevation: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  tabIcon: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
  },
});
