import { View, Text, StyleSheet } from "react-native";

export default function BookingScreen({ route }) {
  const { bookingID, eventID, type, userRole } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking Screen</Text>
      {type === "event" && <Text>Event ID: {eventID}</Text>}
      {type === "booking" && <Text>Booking ID: {bookingID}</Text>}
      {type === "create" && <Text>Create New Booking</Text>}
      <Text>User Role: {userRole}</Text>
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
