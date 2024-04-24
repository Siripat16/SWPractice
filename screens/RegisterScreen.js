import React, { useState } from "react";
import registrationLogo from "../assets/registration.png";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios"; // Import axios to make HTTP requests
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook


export default function SignUpScreen({ route }) {
  // const { userRole } = route.params;
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigation = useNavigation(); // Get the navigation object

  // Update the state as the user types
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    
    // API endpoint
    const apiURL = 'http://127.0.0.1:2000/api/v1/auth/register';
  
    // Payload, here you can replace static values with form data if needed
    const payload = {
      name: formData.name || "User04", // Replace "User04" with formData.name if the name is supposed to be input by the user
      emailAddress: formData.email || "Usertest03@gmail.com", // Same as above for email
      password: formData.password || "usertest01",
      role: formData.role || "user", // Make sure role is included in your form data or state if it's dynamic
      telPhone: formData.tel || "0123456788" // And for telephone
    };
  
    try {
      const response = await axios.post(apiURL, payload);
      console.log(response.data); // Log the successful response from the server
  
      // Optionally handle the response further, like navigating to another screen
      if (response.data) {
        navigation.navigate("Login"); // Navigate to Login screen on success
      }
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error);
      Alert.alert(
        "Registration failed",
        error.response?.data?.message || "An error occurred"
      );
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Take the full height of the screen
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.headerText}>Create your account</Text>
        {/* <Image source={registrationLogo} style={styles.logo} /> */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Name"
            style={styles.input}
            onChangeText={(text) => handleInputChange("name", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tel</Text>
          <TextInput
            placeholder="Tel"
            keyboardType="phone-pad"
            style={styles.input}
            onChangeText={(text) => handleInputChange("tel", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={(text) => handleInputChange("email", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => handleInputChange("password", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        {/* <Text>{userRole}</Text> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  inputContainer: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  label: {
    alignSelf: "flex-start",
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
});
