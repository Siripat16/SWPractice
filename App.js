import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import EventScreen from "./screens/EventScreen";
import BookingScreen from "./screens/BookingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import CompanyProfileScreen from "./screens/CompanyProfileScreen";
import { Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const userRole = "admin"; //or 'user'

export default function App() {
  // const [isModalVisible, setModalVisible] = useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          title: "Dashboard",
          headerStyle: {
            backgroundColor: "#3a568c",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#ffffff",
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // initialParams={{ result: "Initial Result" }}
          // options={{
          //   title: "Welcome home",
          //   headerStyle: {
          //     backgroundColor: '#6a51ae'
          //   },
          //   headerTintColor: '#fff',
          //   headerTitleStyle: {
          //     fontWeight: 'bold'
          //   },
          //   headerRight: () => (
          //     <Pressable onPress={() => alert('Menu button pressed!')}>
          //       <Text style={{color: '#fff', fontSize: 16}}>Menu</Text>
          //     </Pressable>
          //   ),
          //   contentStyle: {
          //     backgroundColor: '#e8e4f3'
          //   }
          // }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
        <Stack.Screen
          name="CompanyProfile"
          component={CompanyProfileScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
        <Stack.Screen
          name="Event"
          component={EventScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
