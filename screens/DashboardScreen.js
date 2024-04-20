import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, Image, Button, TouchableOpacity, Alert
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
    const [userDetails, setUserDetails] = useState({
        userRole: '',
        userID: '',
        token: ''
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const storedUserRole = await AsyncStorage.getItem('userRole');
                const storedUserID = await AsyncStorage.getItem('userID');
                const storedToken = await AsyncStorage.getItem('userToken');
                // console.log("Stored Role:", await AsyncStorage.getItem('userRole'));
                // console.log("Stored ID:", await AsyncStorage.getItem('userID'));
                setUserDetails({
                    userRole: storedUserRole,
                    userID: storedUserID,
                    token: storedToken
                });
                
            } catch (error) {
                console.error("Error retrieving user details from AsyncStorage:", error);
            }
        };

        fetchUserDetails();
    }, []);
    // console.log(userDetails.userID);
    // console.log(userDetails.userRole);

    const [eventData, setEventData] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:2000/api/v1/events/getEvents');
                setEventData(response.data.data);
            } catch (error) {
                console.error('Error fetching event data:', error);
                Alert.alert('Error', 'Unable to fetch events');
            }
        };

        fetchEvents();
    }, []);

    const bookingData = [
        {
            bookingID: 'b123456',
            date: '1 Jan 2024',
            time: '11:00 AM',
            companyName: 'Google',
            position: 'Software Engineer',
        },
        {
            bookingID: 'b123457',
            date: '2 Jan 2024',
            time: '10:00 AM',
            companyName: 'Amazon',
            position: 'Data Analyst',
        },
        {
            bookingID: 'b123458',
            date: '3 Jan 2024',
            time: '9:00 AM',
            companyName: 'META',
            position: 'Product Manager',
        },
    ];
    const renderRightActions = (progress, dragX, bookingID) => {
        return (
            <View style={styles.deleteContainer}>
                <TouchableOpacity onPress={() => Alert.alert(
                    'Delete Booking',
                    'Are you sure you want to delete this booking?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => deleteBooking(bookingID) },
                    ],
                    { cancelable: false }
                )} style={styles.deleteButton}>
                    <Text style={{ color: 'white' }}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const deleteBooking = (bookingID) => {
        console.log(`Booking ${bookingID} deleted`);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight:20, paddingTop: 5 }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10, paddingTop: 25, color: '#333', borderBottomWidth: 1, borderBottomColor: '#e1e4e8' }}>For You</Text>
                    {userDetails.userRole === 'admin' && (
                        <TouchableOpacity onPress={() => navigation.navigate('Booking', { type: 'create' })}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#007BFF' }}>Create</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <ScrollView
                    horizontal={true}
                    style={{ height: 380, marginTop: 5 }}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingStart: 10, paddingEnd: 10 }}
                >
                    {eventData.map((event, index) => (
                        <TouchableOpacity key={index} onPress={() => navigation.navigate('Booking', { eventID: event._id, type: 'event' })}>
                            <View style={styles.box}>
                                <Image source={{ uri: 'https://example.com/path/to/image.png' }} style={styles.image} />
                                <Text style={styles.eventName}>{event.eventTitle}</Text>
                                <Text style={styles.eventDescription}>{event.eventDescription}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text style={styles.header}>Your Bookings</Text>
                <ScrollView style={styles.bookingScrollView}>
                    {bookingData.map((booking, index) => (
                        <Swipeable
                            key={index}
                            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, booking.bookingID)}
                            friction={2}
                        >
                            <View style={styles.bookingBox}>
                                <Text style={styles.bookingDate}>{booking.date}</Text>
                                <Text style={styles.bookingCompanyName}>{booking.companyName}</Text>
                                <Text style={styles.bookingPosition}>{booking.position}</Text>
                                <Text style={styles.bookingTime}>{booking.time}</Text>
                                <TouchableOpacity style={styles.bookingButton}>
                                    <Text style={styles.buttonText} onPress={() => navigation.navigate('Booking', { type: 'See booking' })}>See Booking</Text>
                                </TouchableOpacity>
                            </View>
                        </Swipeable>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Ensuring uniform background color
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: 25,
        // backgroundColor: '#f8f9fa', // Light gray background for headers
        color: '#333', // Darker text color for better readability
        borderBottomWidth: 1,
        borderBottomColor: '#e1e4e8', // Subtle separation
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
        height: 250,
        backgroundColor: '#ffffff', // White background for the cards
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
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 10, // Added margin for better text alignment
    },
    eventDescription: {
        color: '#666',
        fontSize: 14,
        marginHorizontal: 10, // Horizontal margin for alignment
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8, // Rounded corners on top only
    },
    bookingScrollView: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    bookingBox: {
        backgroundColor: '#ffffff',
        padding: 15,
        // marginVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd', // Subtle border color
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3, // Elevation for shadow on Android
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Aligns children elements to the left
        marginBottom: 4,
        marginTop: 4,
    },
    bookingDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bookingCompanyName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#555', // Slightly lighter than the date text
    },
    bookingPosition: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#555',
        marginTop: 5,
    },
    bookingTime: {
        fontSize: 15,
        color: '#555',
        marginTop: 5,
    },
    createButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF', // Bootstrap primary blue
    },
    deleteContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        
        height: '95%',
        borderRadius: 8,
        marginLeft: 20,
        
    },
    bookingButton: {
        backgroundColor: '#007BFF', // Sets the button color to blue
        padding: 10,
        marginTop: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', // Ensures the button stretches to fill its container
    },
    buttonText: {
        color: 'white', // Ensures text is white for better contrast on the blue background
        fontSize: 16,
        fontWeight: 'bold',
    }
});
