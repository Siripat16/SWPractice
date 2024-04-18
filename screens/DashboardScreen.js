import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function DashboardScreen({ navigation, route }) {
  const { userRole } = route.params;
  const eventData = [
    {
      eventID: "e123456",
      eventName: "META x Chula Job Fair 2024",
      eventDescription:
        "Best opportunity to get hiredBest opportunity to get hired",
      CompanyInfo: {
        companyID: "1234567",
        Image:
          "https://images.unsplash.com/photo-1636051028886-0059ad2383c8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Assuming this would be a valid URL
      },
    },
    {
      eventID: "e123457",
      eventName: "Amazon x Chula Job Fair 2024",
      eventDescription:
        "Best opportunity to get hiredBest opportunity to get hired",
      CompanyInfo: {
        companyID: "1234568",
        Image:
          "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Assuming this would be a valid URL
      },
    },
    {
      eventID: "e123458",
      eventName: "Google x Chula Job Fair 2024",
      eventDescription:
        "Best opportunity to get hiredBest opportunity to get hired",
      CompanyInfo: {
        companyID: "1234569",
        Image:
          "https://images.unsplash.com/photo-1529612700005-e35377bf1415?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Assuming this would be a valid URL
      },
    },
  ];

  const bookingData = [
    {
      bookingID: "b123456",
      date: "1 Jan 2024",
      time: "11:00 AM",
      companyName: "Google",
      position: "Software Engineer",
    },
    {
      bookingID: "b123457",
      date: "2 Jan 2024",
      time: "10:00 AM",
      companyName: "Amazon",
      position: "Data Analyst",
    },
    {
      bookingID: "b123458",
      date: "3 Jan 2024",
      time: "9:00 AM",
      companyName: "META",
      position: "Product Manager",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 20,
          paddingTop: 25,
        }}>
        <Text style={styles.header}>For You</Text>
        {userRole === "admin" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Booking", { type: "create" })}>
            <Text style={styles.createButton}>Create</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal={true}
        style={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}>
        {eventData.map((event, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("Booking", {
                eventID: event.eventID,
                type: "event",
              })
            }>
            <View style={styles.box}>
              <Image
                source={{ uri: event.CompanyInfo.Image }}
                style={styles.image}
              />
              <Text style={styles.eventName}>{event.eventName}</Text>
              <Text style={styles.eventDescription}>
                {event.eventDescription}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.header}>Your Bookings</Text>
      <ScrollView style={styles.bookingScrollView}>
        {bookingData.map((booking, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("Booking", {
                bookingID: booking.bookingID,
                type: "booking",
              })
            }>
            <View style={styles.bookingBox}>
              <Text style={styles.bookingDate}>{booking.date}</Text>
              <Text style={styles.bookingCompanyName}>
                {booking.companyName}
              </Text>
              <Text style={styles.bookingPosition}>{booking.position}</Text>
              <Text style={styles.bookingTime}>{booking.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Ensuring uniform background color
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 25,
    // backgroundColor: '#f8f9fa', // Light gray background for headers
    color: "#333", // Darker text color for better readability
    borderBottomWidth: 1,
    borderBottomColor: "#e1e4e8", // Subtle separation
  },
  horizontalScroll: {
    height: 350,
    marginTop: 5, // Give some space from the header
  },
  scrollViewContainer: {
    paddingStart: 10,
    paddingEnd: 10,
  },
  box: {
    width: 200,
    height: 260,
    backgroundColor: "#ffffff", // White background for the cards
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevation for shadow on Android
  },
  eventName: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    margin: 10, // Added margin for better text alignment
  },
  eventDescription: {
    color: "#666",
    fontSize: 14,
    marginHorizontal: 10, // Horizontal margin for alignment
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8, // Rounded corners on top only
  },
  bookingScrollView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bookingBox: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd", // Subtle border color
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Elevation for shadow on Android
  },
  bookingDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bookingCompanyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#555", // Slightly lighter than the date text
  },
  bookingPosition: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#555",
    marginTop: 5,
  },
  bookingTime: {
    fontSize: 15,
    color: "#555",
    marginTop: 5,
  },
  createButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF", // Bootstrap primary blue
  },
});
