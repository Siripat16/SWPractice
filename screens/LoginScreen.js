import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Platform,
} from "react-native";

export default function LoginScreen({ route }) {
  const { userRole } = route.params;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Take the full height of the screen
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Optional offset setting
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.headerText}>Login</Text>
        <Image source={require("../assets/job-fair.png")} style={styles.logo} />
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => {
            /* Handle forgot password here */
          }}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text>
          Don't have account?{" "}
          <Text
            onPress={() => {
              /* Handle navigation to SignUp here */
            }}
            style={styles.linkText}>
            <Text>{userRole}</Text>
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

    padding: 20, // Added padding
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30, // Increase the bottom margin for header
  },
  logo: {
    width: 200, // Adjust the size as per your image
    height: 200, // Adjust the size as per your image
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
    color: "#0000ff", // Blue color for the link
    marginTop: 10, // Spacing above the link
  },
  linkText: {
    color: "#0000ff", // Blue color for the link
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
  },
});
