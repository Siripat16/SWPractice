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
} from "react-native";

export default function SignUpScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.headerText}>SignUp</Text>
      <Image source={registrationLogo} style={styles.logo} />
      <Text>Name</Text>
      <TextInput placeholder="Name" style={styles.input} />
      <Text>Tel</Text>
      <TextInput
        placeholder="Tel"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <Text>Email</Text>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={styles.input}
      />
      <Text>Password</Text>
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Text>Confirm password</Text>
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
  input: {
    height: 50,
    width: "90%", // slightly less than full width for better margins
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
    width: "90%", // matching the width of inputs
  },
  buttonText: {
    color: "#fff",
    fontSize: 18, // enhanced readability
    textAlign: "center",
  },
});
