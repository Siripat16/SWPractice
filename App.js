import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import EventScreen from './screens/EventScreen';
import BookingScreen from './screens/BookingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import CompanyProfileScreen from './screens/CompanyProfileScreen';
import { Pressable, Text } from 'react-native';

const Stack = createNativeStackNavigator();
const userRole = 'admin';  
// const userRole = 'user'; 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{
          title: "Dashboard",
          headerStyle: {
            backgroundColor: '#3a568c'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          contentStyle: {
            backgroundColor: '#ffffff'
          }
        }}
      >
        <Stack.Screen 
          name='Home'
          component={HomeScreen}
          initialParams={{ userRole: userRole }}
          options={({ navigation }) => ({
            title: "Home",
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerRight: () => (
              <Pressable onPress={() => {
                const targetScreen = userRole === 'admin' ? 'CompanyProfile' : 'UserProfile';
                navigation.navigate(targetScreen, { userRole });
              }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Profile</Text>
              </Pressable>
            ),
          })}
        />
        {/* Add initialParams to each screen similarly */}
        <Stack.Screen name='Login' component={LoginScreen} initialParams={{ userRole: userRole }} options={{ title: 'Login' }} />
        <Stack.Screen name='Register' component={RegisterScreen} initialParams={{ userRole: userRole }} options={{ title: 'Register' }} />
        <Stack.Screen name='UserProfile' component={UserProfileScreen} initialParams={{ userRole: userRole }} options={{ title: 'UserProfile' }} />
        <Stack.Screen name='CompanyProfile' component={CompanyProfileScreen} initialParams={{ userRole: userRole }} options={{ title: 'CompanyProfile' }} />
        <Stack.Screen name='Dashboard' component={DashboardScreen} initialParams={{ userRole: userRole }} options={{ title: 'Dashboard' }} />
        <Stack.Screen name='Event' component={EventScreen} initialParams={{ userRole: userRole }} options={{ title: 'Event' }} />
        <Stack.Screen name='Booking' component={BookingScreen} initialParams={{ userRole: userRole }} options={{ title: 'Booking' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
