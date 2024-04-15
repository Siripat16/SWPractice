import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import axios from 'axios';

export default function UserProfileScreen({ navigation }) {
    // Initial user profile state with mock data
    const [userProfile, setUserProfile] = useState({
        name: "Jane Doe",
        phoneNumber: "+1234567890",
        email: "johndoe@example.com",
        profilePicture: "https://plus.unsplash.com/premium_photo-1683140621573-233422bfc7f1?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3R1ZGVudCUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        resumeLink: "https://example.com/resume.pdf"
    });
    const [editable, setEditable] = useState(false);

    const handleEdit = async () => {
        if (editable) {
            // When toggling from editable to non-editable, save the data
            await saveProfileData();
        }
        setEditable(!editable);
    };

    const saveProfileData = async () => {
        try {
            const response = await axios.post('https://api.example.com/update-profile', userProfile);
            // Assuming the API returns the updated user profile
            setUserProfile(response.data);
            console.log('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleLogout = () => {
        console.log('Logout button tapped');
        navigation.navigate('Home');
    };

    const handleUploadResume = () => {
        console.log('Upload Resume');
        // Implement upload functionality or set to open file picker
    };

    const handleDownloadResume = () => {
        // Assuming that the link to the resume is valid and accessible
        Linking.openURL(userProfile.resumeLink).catch(err => {
            console.error("Failed to open the link:", err);
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Text style={styles.editButtonText}>{editable ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>

            <Image source={{ uri: userProfile.profilePicture }} style={styles.profilePic} />

            {editable ? (
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setUserProfile({...userProfile, name: text})}
                    value={userProfile.name}
                />
            ) : (
                <Text style={styles.infoText}>{userProfile.name}</Text>
            )}

            {editable ? (
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setUserProfile({...userProfile, phoneNumber: text})}
                    keyboardType="phone-pad"
                    value={userProfile.phoneNumber}
                />
            ) : (
                <Text style={styles.infoText}>{userProfile.phoneNumber}</Text>
            )}

            {editable ? (
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setUserProfile({...userProfile, email: text})}
                    value={userProfile.email}
                />
            ) : (
                <Text style={styles.infoText}>{userProfile.email}</Text>
            )}

            {editable ? (
                <TouchableOpacity style={styles.resumeButton} onPress={handleUploadResume}>
                    <Text style={styles.resumeButtonText}>Upload New Resume</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.resumeButton} onPress={() => console.log('Download Resume')}>
                    <Text style={styles.resumeButtonText}>Download Resume</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        paddingVertical: 20,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    input: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: '80%',
        borderRadius: 5,
    },
    editButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 8,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
    },
    resumeButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    resumeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    logoutButton: {
        width: '80%',
        marginBottom: 20,
    },
    resumeCard: {
        width: '90%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 20,
    },
    resumeTitle: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    downloadButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    downloadButtonText: {
        color: 'white',
        fontSize: 16,
    },


});
