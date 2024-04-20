import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

export default function ManageResume({ route }) {
    const { studentID, userRole } = route.params;

    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        profilePicture: null,
        resume: null
    });

    const fetchUserProfile = async () => {
        try {
            const url = `http://127.0.0.1:2000/api/v1/auth/user/${studentID}`;
            const response = await axios.get(url);
            if (response.data.success && response.data.data) {
                const profileData = response.data.data;
                const imageUri = profileData.picture ? `data:image/jpeg;base64,${profileData.picture}` : null;
                const resumeUri = profileData.resume ? `data:application/pdf;base64,${profileData.resume}` : null;

                setUserProfile({
                    name: profileData.name,
                    email: profileData.emailAddress,
                    phoneNumber: profileData.telPhone,
                    profilePicture: imageUri,
                    resume: resumeUri
                });
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const openPDF = async () => {
        if (userProfile.resume) {
            await WebBrowser.openBrowserAsync(userProfile.resume);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Company Profile Screen</Text>
            <Text style={styles.text}>{userRole}</Text>
            <Text style={styles.text}>{userProfile.name}</Text>
            <Text style={styles.text}>{userProfile.email}</Text>
            <Button title="View Resume PDF" onPress={openPDF} />
            <Text style={styles.text}>{userProfile.phoneNumber}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    }
});
