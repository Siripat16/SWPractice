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
  const { userRole } = route.params;
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
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          name: formData.name,
          emailAddress: formData.email,
          role: userRole, // Pass the role from the route params or set a default
          password: formData.password,
          telPhone: formData.tel,
        }
      );
      if (response.data) {
        navigation.navigate("Login"); // Navigate to Login screen on success
      }
    } catch (error) {
      // Handle errors here
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Optional offset setting
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.headerText}>SignUp</Text>
        <Image source={registrationLogo} style={styles.logo} />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput placeholder="Name" style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tel</Text>
          <TextInput
            placeholder="Tel"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text>{userRole}</Text>
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
