import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Storing the token
  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error saving the token', error);
    }
  };

  // Handle form submission for login
  const handleLogin = async () => {
    const loginURL = 'http://127.0.0.1:2000/api/v1/auth/login';
    const payload = {
      emailAddress: email,
      password: password
    };
  
    try {
      const loginResponse = await axios.post(loginURL, payload);
      // console.log(loginResponse.data); // Log the response data
  
      // Check if login was successful
      if (loginResponse.data.success && loginResponse.data.token) {
        await AsyncStorage.setItem('userToken', loginResponse.data.token); // Store the token
        fetchUserRole(); // Now fetch user role after storing the token
      }
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred during login"
      );
    }
  };
  

  const fetchUserRole = async () => {
    const userURL = 'http://127.0.0.1:2000/api/v1/auth/getLoggedInUser/';
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve the stored token
      const userResponse = await axios.get(userURL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (userResponse.data.success) {
        const { role, _id } = userResponse.data.data;
  
        // Store role and ID in AsyncStorage
        await AsyncStorage.setItem('userRole', role);
        await AsyncStorage.setItem('userID', _id);

        // Verification step: Check what has just been stored
        // console.log("Stored Role:", await AsyncStorage.getItem('userRole'));
        // console.log("Stored ID:", await AsyncStorage.getItem('userID'));

        // Navigate to Dashboard with role and ID as parameters if needed
        navigation.navigate('Dashboard');
      } else {
        throw new Error("Failed to fetch user role");
      }
    } catch (error) {
      console.error("Fetching user role failed:", error);
      Alert.alert(
        "Error",
        "Unable to fetch user details after login."
      );
    }
  };
  
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.headerText}>Login</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => { /* Handle forgot password here */ }}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text>
          Don't have an account?{" "}
          <Text
            onPress={() => navigation.navigate("SignUp")}
            style={styles.linkText}>
            create a new account
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  forgotPasswordText: {
    color: "#0000ff",
    marginTop: 10,
  },
  linkText: {
    color: "#0000ff",
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
  },
});
