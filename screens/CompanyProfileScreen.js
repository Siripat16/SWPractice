import React, { useState , useEffect} from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CompanyProfileScreen({ navigation }) {
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
    const [companyProfile, setCompanyProfile] = useState({
        logoUrl: "https://images.unsplash.com/photo-1529612700005-e35377bf1415?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Tech Innovations Inc.",
        description: "We lead the way in innovative technology solutions, providing next-generation services and products across the globe.",
        phone: "+1234567890",
        email: "contact@techinnovations.com"
    });
    const [editable, setEditable] = useState(false);

    const handleEdit = () => {
        setEditable(!editable);
    };

    const handleLogout = async () => {
        console.log('Logout button tapped');
    
        try {
            const response = await axios.get('http://127.0.0.1:2000/api/v1/auth/logout', {
                headers: {
                    'Authorization': `Bearer ${userDetails.token}`
                }
            });
    
            if (response.data && response.data.success) {
                console.log('Logout successful');
    
                // Clear user details from state and AsyncStorage
                setUserDetails({
                    userRole: '',
                    userID: '',
                    token: ''
                });
    
                await AsyncStorage.multiRemove(['userRole', 'userID', 'userToken']);
    
                // Navigate to the home screen
                navigation.navigate('Home');
            } else {
                console.error('Logout failed with response:', response.data);
            }
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Text style={styles.editButtonText}>{editable ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
            <View style={styles.bannerContainer}>
                <Image source={{ uri: companyProfile.logoUrl }} style={styles.banner} resizeMode="cover" />
            </View>
            

            {editable ? (
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setCompanyProfile({ ...companyProfile, name: text })}
                    value={companyProfile.name}
                />
            ) : (
                <Text style={styles.nameText}>{companyProfile.name}</Text>
            )}

            {editable ? (
                <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    onChangeText={(text) => setCompanyProfile({ ...companyProfile, description: text })}
                    value={companyProfile.description}
                    multiline={true}
                    numberOfLines={4}
                />
            ) : (
                <Text style={styles.descriptionText}>{companyProfile.description}</Text>
            )}

            {editable ? (
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setCompanyProfile({ ...companyProfile, phone: text })}
                    value={companyProfile.phone}
                />
            ) : (
                <Text style={styles.infoText}>{companyProfile.phone}</Text>
            )}

            {editable ? (
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setCompanyProfile({ ...companyProfile, email: text })}
                    value={companyProfile.email}
                />
            ) : (
                <Text style={styles.infoText}>{companyProfile.email}</Text>
            )}

            <View style={styles.logoutButton}>
                <Button title="Logout" onPress={handleLogout} color="#D9534F" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 20,
    },
    bannerContainer: {
        width: '100%',
        marginBottom: 20,
    },
    banner: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    infoText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    input: {
        fontSize: 18,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: '80%',
        borderRadius: 5,
        marginBottom: 10,
    },
    descriptionInput: {
        minHeight: 100,
    },
    editButton: {
        marginBottom: 10,
        alignSelf: 'flex-end',
        padding: 8,

    },
    editButtonText: {
        color: '#0000EE',
        fontSize: 16,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: '80%'
    }
});
