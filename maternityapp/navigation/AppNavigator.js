import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import WelcomeScreen from '../screens/WelcomeScreen';
import NotRegisteredScreen from '../screens/NotRegisteredScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportsScreen from '../screens/ReportsScreen';
import HelpScreen from '../screens/HelpScreen';
import AIHealthBotScreen from '../screens/AIHealthBotScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4caf50',
        tabBarInactiveTintColor: '#b0c4de',
        tabBarStyle: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, height: 62, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Reports') {
            return <MaterialCommunityIcons name="file-document-outline" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name="person-circle-outline" size={size} color={color} />;
          } else if (route.name === 'AI Health Bot') {
            return <Ionicons name="chatbubbles-outline" size={size} color={color} />;
          }
        },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 13, marginBottom: 2 },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} initialParams={{ pregnancyId: null }} />
      <Tab.Screen name="Reports" component={ReportsScreen} initialParams={{ pregnancyId: null }} />
      <Tab.Screen name="AI Health Bot" component={AIHealthBotScreen} options={{ title: 'AI Health Bot' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotRegistered" component={NotRegisteredScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
