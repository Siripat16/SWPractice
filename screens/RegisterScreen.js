import React from "react";
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
  Platform, // Import Platform to handle platform-specific adjustments
} from "react-native";

export default function SignUpScreen({ route }) {
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
        <TouchableOpacity style={styles.button}>
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
