import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import context
import { AppProvider } from './context/AppContext';

// Import debug utilities (for browser console debugging)
import './utils/debugHelper';

// Import components
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

// Import screens
import LiveGamesScreen from './screens/LiveGamesScreen';
import RaffleScreen from './screens/RaffleScreen';
import MerchScreen from './screens/MerchScreen';
import MyBetsScreen from './screens/MyBetsScreen';
import GameDetailScreen from './screens/GameDetailScreen';
import PlayerStatsScreen from './screens/PlayerStatsScreen';
import { useApp } from './context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function GamesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LiveGames" 
        component={LiveGamesScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GameDetail" 
        component={GameDetailScreen}
        options={{ title: 'Game Details' }}
      />
      <Stack.Screen 
        name="PlayerStats" 
        component={PlayerStatsScreen}
        options={{ title: 'Player Stats' }}
      />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { isLoading } = useApp();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Games') {
              iconName = focused ? 'play-circle' : 'play-circle-outline';
            } else if (route.name === 'Raffle') {
              iconName = focused ? 'ticket' : 'ticket-outline';
            } else if (route.name === 'Merch') {
              iconName = focused ? 'bag' : 'bag-outline';
            } else if (route.name === 'MyBets') {
              iconName = focused ? 'receipt' : 'receipt-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#333',
          },
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen 
          name="Games" 
          component={GamesStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Raffle" 
          component={RaffleScreen}
          options={{ title: 'Raffle' }}
        />
        <Tab.Screen 
          name="Merch" 
          component={MerchScreen}
          options={{ title: 'Merch' }}
        />
        <Tab.Screen 
          name="MyBets" 
          component={MyBetsScreen}
          options={{ title: 'My Bets' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
