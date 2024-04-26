import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, Image, Button, TouchableOpacity, Alert, RefreshControl
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('userToken');
        if (!storedToken) {
            console.error('No token found');
            Alert.alert('Error', 'Authentication token is missing');
            return;
        }
    
        let url = userDetails.userRole === 'admin' ?
            `http://127.0.0.1:2000/api/v1/bookingDetails/getBookingDetailsForAdmin/${userDetails.userID}` :
            `http://127.0.0.1:2000/api/v1/bookingDetails/getBookingDetailsByUser/${userDetails.userID}`;
    
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${storedToken}` // Include the token in the header
                }
            });
            if (response.data && response.data.success) {
                setBookings(response.data.data);
                setBookingError(response.data.data.length === 0);
                setErrorMessage(response.data.data.length === 0 ? 'No booking information available' : '');
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
        console.log('--->', userDetails.userRole);
        if (!userDetails.userRole || !userDetails.userID) return;
    
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('userToken');
        if (!storedToken) {
            console.error('No token found');
            Alert.alert('Error', 'Authentication token is missing');
            return;
        }
    
        let url;
        if (userDetails.userRole === 'admin') {
            console.log('its here1');
            // For admins, fetch events related to the user
            url = `http://127.0.0.1:2000/api/v1/events/users/${userDetails.userID}`;
        } else {
            // For regular users, fetch all events
            url = 'http://127.0.0.1:2000/api/v1/events/getEvents';
            console.log('its here');
        }
    
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${storedToken}` // Include the token in the header
                }
            });
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
    

    // useEffect hook to callf fetchEvents
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
    console.log('user detail',userDetails);
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
                        style={{ height: 270, marginTop: 5 }}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingStart: 10, paddingEnd: 10 }}
                    >
                        {eventData.map((event, index) => (
                            <View key={event.id || index} style={styles.box}>
                                <Image source={require("../assets/thumbnail4.png")} style={styles.image} />
                                <View style={styles.eventTextBox}>
                                    <Text style={styles.eventName}>{event.eventTitle}</Text>
                                    <Text style={styles.eventDescription}>{event.eventDescription}</Text>
                                </View>
                                
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
        backgroundColor: '#fff', // Uniform background color for consistency
    },
    profileContainer: {
        backgroundColor: '#f7f7f7', // Light grey background for contrast
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    profileHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    profileInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    profileLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    profileValue: {
        fontSize: 16,
        color: '#333',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 25,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e4e8',
    },
    horizontalScroll: {
        height: 230,
        marginTop: 5,
    },
    scrollViewContainer: {
        paddingStart: 10,
        paddingEnd: 10,
    },
    box: {
        width: 200,
        height: 260,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
        paddingBottom: 10,
        justifyContent: 'space-between',
    },
    eventName: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    eventDescription: {
        color: '#666',
        fontSize: 14,
        margin: 5,
    },
    eventTextBox: {
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start', // This will align items to the top
    },
    image: {
        width: '100%',
        height: 140,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    bookingScrollView: {
        paddingHorizontal: 20,
    },
    bookingBox: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
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
        color: '#555',
        marginTop: 5,
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
    noBookingView: {
        padding: 20,
        alignItems: 'center',
    },
    noBookingText: {
        fontSize: 16,
        color: '#666',
    },
});

