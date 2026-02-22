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
import { SearchScreen } from '../screens/SearchScreen';

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

/* ---- Saved stack: SavedList -> Recipe ---- */
const SavedStack = createNativeStackNavigator();
const SavedStackNavigator: React.FC = () => (
  <SavedStack.Navigator screenOptions={defaultStackOptions}>
    <SavedStack.Screen
      name="SavedList"
      component={SavedRecipesScreen as any}
      options={{ headerShown: false }}
    />
    <SavedStack.Screen
      name="Recipe"
      component={RecipeScreen as any}
      options={{ headerTitle: 'Favorite Recipe', headerBackTitle: 'Back' }}
    />
  </SavedStack.Navigator>
);

/* ---- Search stack: SearchScreen -> Recipe ---- */
const SearchStack = createNativeStackNavigator();
const SearchStackNavigator: React.FC = () => (
  <SearchStack.Navigator screenOptions={defaultStackOptions}>
    <SearchStack.Screen
      name="SearchList"
      component={SearchScreen as any}
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="Recipe"
      component={RecipeScreen as any}
      options={{ headerTitle: 'Recipe', headerBackTitle: 'Back' }}
    />
  </SearchStack.Navigator>
);

/* ---- Create stack: CreateForm -> Recipe ---- */
const CreateStack = createNativeStackNavigator();
const CreateStackNavigator: React.FC = () => (
  <CreateStack.Navigator screenOptions={defaultStackOptions}>
    <CreateStack.Screen
      name="CreateForm"
      component={CreateRecipeScreen}
      options={{ headerShown: false }}
    />
    <CreateStack.Screen
      name="Recipe"
      component={RecipeScreen as any}
      options={{ headerTitle: 'New Recipe', headerBackTitle: 'Back' }}
    />
  </CreateStack.Navigator>
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
      component={SavedStackNavigator}
      options={{
        tabBarLabel: 'Saved',
        tabBarIcon: ({ focused }) => <TabIcon label="S" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="SearchTab"
      component={SearchStackNavigator}
      options={{
        tabBarLabel: 'Search',
        tabBarIcon: ({ focused }) => <TabIcon label="🔍" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="CreateTab"
      component={CreateStackNavigator}
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
