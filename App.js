import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DashboardScreen from "./screens/DashboardScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import CompanyProfileScreen from "./screens/CompanyProfileScreen";
// import EventScreen from "./screens/EventScreen";


const Stack = createNativeStackNavigator();

function NavigationStack() {
  const [userDetails, setUserDetails] = React.useState({ userRole: '', userID: '', token: '' });
  const navigation = useNavigation();

  const fetchUserRole = async () => {
    const userURL = 'http://127.0.0.1:2000/api/v1/auth/getLoggedInUser/';
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userResponse = await axios.get(userURL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (userResponse.data.success) {
        const { role, _id } = userResponse.data.data;
        setUserDetails({
          userRole: role,
          userID: _id,
        });
      } else {
        throw new Error("Failed to fetch user role");
      }
    } catch (error) {
      console.error("Fetching user role failed:", error);
      Alert.alert("Error", "Unable to fetch user details after login.");
    }
  };

  // React.useEffect(() => {
  //   fetchUserRole();
  // }, []);

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: "#3a568c" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#ffffff" },
      }}>
      <Stack.Screen name="Home" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      {/* <Stack.Screen name="Event" component={EventScreen} /> */}
      {/* <Stack.Screen name="Booking" component={BookingScreen} /> */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  );
}
