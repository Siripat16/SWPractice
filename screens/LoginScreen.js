import { View, Text, StyleSheet } from "react-native";

export default function LoginScreen({ route }) {
    const { userRole } = route.params;
    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
            <Text>{userRole}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
