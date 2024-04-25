import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, Image, Button, TouchableOpacity, Alert, RefreshControl
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DashboardScreen({ navigation }) {
    
    const timeOnlyOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const dateOnlyOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    };

    const [userDetails, setUserDetails] = useState({
        userRole: '',
        userID: '',
        token: '',
        userName: '',
        email: '',
        tel: ''
    });
    const fetchUserDetails = async () => {
        try {
            const storedUserRole = await AsyncStorage.getItem('userRole');
            const storedUserID = await AsyncStorage.getItem('userID');
            const storedToken = await AsyncStorage.getItem('userToken');
            const storedUserNAme = await AsyncStorage.getItem('userName');
            const storedUserEmail = await AsyncStorage.getItem('userEmail');
            const storedUserTelPhone = await AsyncStorage.getItem('userTelPhone');
            // console.log("Stored Role:", await AsyncStorage.getItem('userRole'));
            // console.log("Stored ID:", await AsyncStorage.getItem('userID'));
            setUserDetails({
                userRole: storedUserRole,
                userID: storedUserID,
                userName: storedUserNAme,
                token: storedToken,
                email: storedUserEmail,
                telPhone: storedUserTelPhone
            });
            
        } catch (error) {
            console.error("Error retrieving user details from AsyncStorage:", error);
        }
    };
    useEffect(() => {
        fetchUserDetails();
    }, []);
    // console.log(userDetails)
    // console.log(userDetails.userID);
    // console.log(userDetails.userRole);

    const [eventData, setEventData] = useState([]);


    const [bookings, setBookings] = useState([]);
    const fetchBookingDetails = async () => {
        if (!userDetails.userRole || !userDetails.userID) return;

        let url = userDetails.userRole === 'admin' ?
            `http://127.0.0.1:2000/api/v1/bookingDetails/getBookingDetailsForAdmin/${userDetails.userID}` :
            `http://127.0.0.1:2000/api/v1/bookingDetails/getBookingDetailsByUser/${userDetails.userID}`;

        try {
            const response = await axios.get(url);
            if (response.data && response.data.success) {
                setBookings(response.data.data);
                setBookingError(response.data.data.length === 0);
                setErrorMessage(response.data.data.length === 0 ? 'No booking information available' : '');
                console.log(bookings)
            } else {
                setBookingError(true);
                setErrorMessage('No booking information available');
            }
        } catch (error) {
            const is404 = error.response && error.response.status === 404;
            setBookingError(true);
            setErrorMessage(is404 ? 'No booking information available' : 'Unable to fetch bookings');
            if (!is404) {
                console.error('Error fetching booking data:', error);
            }
        }
    };

    // useEffect hook to call fetchBookingDetails
    useEffect(() => {
        fetchBookingDetails();
    }, [userDetails.userRole, userDetails.userID]);
    
    const fetchEvents = async () => {
        if (!userDetails.userRole || !userDetails.userID) return;

        let url;
        if (userDetails.userRole === 'admin') {
            // For admins, fetch events related to the user
            url = `http://127.0.0.1:2000/api/v1/events/users/${userDetails.userID}`;
        } else {
            // For regular users, fetch all events
            url = 'http://127.0.0.1:2000/api/v1/events/getEvents';
        }

        try {
            const response = await axios.get(url);
            if (response.data && response.data.success) {
                setEventData(response.data.data);
            } else {
                console.error('No data found');
                Alert.alert('Error', 'No events information available');
            }
        } catch (error) {
            console.error('Error fetching event data:', error);
            Alert.alert('Error', 'Unable to fetch events');
        }
    };

    // useEffect hook to call fetchEvents
    useEffect(() => {
        fetchEvents();
    }, [userDetails.userRole, userDetails.userID]);

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
    // console.log('user detail',userDetails);
    const [bookingError, setBookingError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    //Pull to request
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchUserDetails();  // Refresh user details
            await fetchEvents();       // Refresh events
            await fetchBookingDetails();  // Refresh booking details
        } catch (error) {
            console.error('Refresh error:', error);
        }
        setRefreshing(false);
    };

    // return (
    //     <GestureHandlerRootView style={{ flex: 1 }}>
    //         <SafeAreaView style={{ flex: 1 }}>
                
    //             {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight:20, paddingTop: 5 }}>
    //                 <Text style={{ fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10, paddingTop: 5, color: '#333', borderBottomWidth: 1, borderBottomColor: '#e1e4e8' }}>Your info</Text>
    //             </View> */}
    //             <View style={styles.profileContainer}>
    //             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
    //                 <Text style={styles.profileHeader}>Profile</Text>
    //                 <Button 
    //                     title="See more" 
    //                     onPress={() => {
    //                         // Check the user role and navigate accordingly
    //                         const targetScreen = userDetails.userRole === 'admin' ? 'CompanyProfile' : 'UserProfile';
    //                         navigation.navigate(targetScreen, { userID: userDetails.userID, token: userDetails.token });
    //                     }} 
    //                 />
    //             </View>

    //                 <View style={styles.profileInfo}>
    //                     <Text style={styles.profileLabel}>Name:</Text>
    //                     <Text style={styles.profileValue}>{userDetails.userName}</Text>
    //                 </View>
    //                 <View style={styles.profileInfo}>
    //                     <Text style={styles.profileLabel}>Email:</Text>
    //                     <Text style={styles.profileValue}>{userDetails.email}</Text>
    //                 </View>
    //                 <View style={styles.profileInfo}>
    //                     <Text style={styles.profileLabel}>Tel:</Text>
    //                     <Text style={styles.profileValue}>{userDetails.telPhone}</Text>
    //                 </View>

    //             </View>
    //             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight:20, paddingTop: 5 }}>
    //                 <Text style={{ fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10, paddingTop: 5, color: '#333', borderBottomWidth: 1, borderBottomColor: '#e1e4e8' }}>Events</Text>

    //             </View>
    //             <ScrollView
    //                 horizontal={true}
    //                 style={{ height: 230, marginTop: 5 }}
    //                 showsHorizontalScrollIndicator={false}
    //                 contentContainerStyle={{ paddingStart: 10, paddingEnd: 10 }}
    //             >
    //                 {eventData.map((event, index) => (
    //                         <View key={event.id || index} style={styles.box}> 
    //                             <Text style={styles.eventName}>{event.eventTitle}</Text>
    //                             <Text style={styles.eventDescription}>{event.eventDescription}</Text>
    //                         </View>
    //                 ))}
    //             </ScrollView>
    //             <Text style={styles.header}>Your Bookings</Text>
    //             <ScrollView style={styles.bookingScrollView}>
    //                 {bookingError ? (
    //                     <View style={styles.noBookingView}>
    //                         <Text style={styles.noBookingText}>{errorMessage}</Text>
    //                     </View>
    //                 ) : bookings.map((booking, index) => (
    //                     <Swipeable
    //                         key={index}
    //                         renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, booking.booking._id)}
    //                     >
    //                         <View style={styles.bookingBox}>
    //                             <Text style={styles.bookingDate}>{new Date(booking.event.slot.startTime).toLocaleDateString('en-US', dateOnlyOptions)}</Text>
    //                             <Text style={styles.bookingCompanyName}>{booking.company.name}</Text>
    //                             <Text style={styles.bookingPosition}>{booking.booking.jobPosition}</Text>
    //                             <Text style={styles.bookingTime}>
    //                                 {new Date(booking.event.slot.startTime).toLocaleString('en-US', timeOnlyOptions)}-{new Date(booking.event.slot.endTime).toLocaleString('en-US', timeOnlyOptions)}
    //                             </Text>
    //                         </View>
    //                     </Swipeable>
    //                 ))}
    //             </ScrollView>

    //         </SafeAreaView>
    //     </GestureHandlerRootView>
    // );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    {/* Profile Section */}
                    <View style={styles.profileContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={styles.profileHeader}>Profile</Text>
                            <Button 
                                title="See more" 
                                onPress={() => {
                                    // Navigate based on user role
                                    const targetScreen = userDetails.userRole === 'admin' ? 'CompanyProfile' : 'UserProfile';
                                    navigation.navigate(targetScreen, { userID: userDetails.userID, token: userDetails.token });
                                }} 
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileLabel}>Name:</Text>
                            <Text style={styles.profileValue}>{userDetails.userName}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileLabel}>Email:</Text>
                            <Text style={styles.profileValue}>{userDetails.email}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileLabel}>Tel:</Text>
                            <Text style={styles.profileValue}>{userDetails.telPhone}</Text>
                        </View>
                    </View>
    
                    {/* Events Section */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight:20, paddingTop: 5 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10, paddingTop: 5, color: '#333', borderBottomWidth: 1, borderBottomColor: '#e1e4e8' }}>Events</Text>
                    </View>
                    <ScrollView
                        horizontal={true}
                        style={{ height: 230, marginTop: 5 }}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingStart: 10, paddingEnd: 10 }}
                    >
                        {eventData.map((event, index) => (
                            <View key={event.id || index} style={styles.box}>
                                <Text style={styles.eventName}>{event.eventTitle}</Text>
                                <Text style={styles.eventDescription}>{event.eventDescription}</Text>
                            </View>
                        ))}
                    </ScrollView>
    
                    {/* Bookings Section */}
                    <Text style={styles.header}>Your Bookings</Text>
                    <ScrollView style={styles.bookingScrollView}>
                        {bookingError ? (
                            <View style={styles.noBookingView}>
                                <Text style={styles.noBookingText}>{errorMessage}</Text>
                            </View>
                        ) : bookings.map((booking, index) => (
                            <Swipeable
                                key={index}
                                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, booking.booking._id)}
                            >
                                <View style={styles.bookingBox}>
                                    <Text style={styles.bookingDate}>{new Date(booking.event.slot.startTime).toLocaleDateString('en-US', dateOnlyOptions)}</Text>
                                    <Text style={styles.bookingCompanyName}>{booking.company.name}</Text>
                                    <Text style={styles.bookingPosition}>{booking.booking.jobPosition}</Text>
                                    <Text style={styles.bookingTime}>
                                        {new Date(booking.event.slot.startTime).toLocaleString('en-US', timeOnlyOptions)}-{new Date(booking.event.slot.endTime).toLocaleString('en-US', timeOnlyOptions)}
                                    </Text>
                                </View>
                            </Swipeable>
                        ))}
                    </ScrollView>
                </GestureHandlerRootView>
            </ScrollView>
        </SafeAreaView>
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
        paddingTop: 0,
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
        height: 150,
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
    },
    profileContainer: {
        backgroundColor: '#f7f7f7', // Light grey background
        padding: 20, // Padding for spacing inside the container
        borderRadius: 10, // Rounded corners
        shadowColor: "#000", // Shadow for 3D effect
        shadowOffset: { width: 0, height: 1 }, // Shadow placement
        shadowOpacity: 0.22, // Shadow opacity
        shadowRadius: 2.22, // Shadow blur radius
        elevation: 3, // Elevation for Android (shadow)
        marginHorizontal: 20, // Horizontal margins
        marginTop: 20, // Top margin
        marginBottom: 10, // Bottom margin to separate from next sections
    },
    profileHeader: {
        fontSize: 24, // Larger font size for headers
        fontWeight: 'bold', // Bold font weight
        color: '#333', // Dark grey for text color
        marginBottom: 10, // Margin below the header for spacing
    },
    profileInfo: {
        flexDirection: 'row', // Layout children in a row
        justifyContent: 'space-between', // Space between items
        marginBottom: 5, // Margin below each row
    },
    profileLabel: {
        fontSize: 16, // Font size for labels
        color: '#666', // Medium grey for label text
        fontWeight: 'bold', // Bold font weight for labels
    },
    profileValue: {
        fontSize: 16, // Font size for values
        color: '#333', // Darker text for emphasis on content
    },
    noBookingView: {
        padding: 20,
        alignItems: 'center',
    },
    noBookingText: {
        fontSize: 16,
        color: '#666',
    },
    
});
