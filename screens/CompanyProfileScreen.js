import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView, TextInput
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

export default function CompanyProfileScreen({ navigation }) {
    const [userDetails, setUserDetails] = useState({
        userRole: '',
        userID: '',
        token: ''
    });

    const [companyProfile, setCompanyProfile] = useState({
        name: "",
        description: "",
        phone: "",
        email: "",
    });

    const [companyId, setCompanyId] = useState(""); // State to store the company ID
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const storedUserRole = await AsyncStorage.getItem('userRole');
            const storedUserID = await AsyncStorage.getItem('userID');
            const storedToken = await AsyncStorage.getItem('userToken');

            setUserDetails({
                userRole: storedUserRole,
                userID: storedUserID,
                token: storedToken
            });

            if (storedUserID && storedToken) {
                try {
                    const response = await axios.get(`http://127.0.0.1:2000/api/v1/companies/getCompanyInfoByUserId/${storedUserID}`, {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });

                    if (response.data.success) {
                        setCompanyId(response.data.data._id); // Store the company ID
                        console.log(response.data.data)
                        setCompanyProfile({
                            name: response.data.data.companyName,
                            description: response.data.data.companyDescription,
                            phone: response.data.data.companyPhone,
                        });
                        
                    } else {
                        console.error('Fetching company data failed:', response.data.message);
                    }
                } catch (error) {
                    console.error("Error retrieving company data:", error);
                }
            }
        };

        fetchUserDetails();
    }, []);
    // console.log(companyProfile)
    const handleEdit = async () => {
        if (editable) {
            // If currently editable, then save the data
            try {
                const payload = {
                    companyName: companyProfile.name,
                    companyPhone: companyProfile.phone,
                    companyDescription: companyProfile.description,
                };
                const response = await axios.put(`http://127.0.0.1:2000/api/v1/companies/updateCompany/${companyId}`, payload, {
                    headers: {
                        'Authorization': `Bearer ${userDetails.token}`
                    }
                });

                if (response.data.success) {
                    console.log('Update successful:', response.data);
                } else {
                    console.error('Update failed:', response.data.message);
                }
            } catch (error) {
                console.error('Update error:', error.response ? error.response.data : error.message);
            }
        }
        setEditable(!editable);  // Toggle the editable state regardless
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:2000/api/v1/auth/logout', {
                headers: {
                    'Authorization': `Bearer ${userDetails.token}`
                }
            });

            if (response.data.success) {
                await AsyncStorage.multiRemove([
                    'userRole', 'userID', 'userToken', 'userName', 'userEmail', 'userTelPhone'
                  ]);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
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
            <Text style={styles.infoText}>{companyProfile.phone}</Text>


            {/* {editable ? (
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setCompanyProfile({ ...companyProfile, email: text })}
                    value={companyProfile.email}
                />
            ) : (
                <Text style={styles.infoText}>{companyProfile.email}</Text>
            )} */}

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
        width: '85%',
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
