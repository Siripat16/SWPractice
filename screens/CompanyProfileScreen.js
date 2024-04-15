import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function CompanyProfileScreen({ navigation }) {
    // Mock data for company profile
    const [companyProfile, setCompanyProfile] = useState({
        logoUrl: "https://images.unsplash.com/photo-1529612700005-e35377bf1415?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for company logo/banner
        name: "Tech Innovations Inc.",
        description: "We lead the way in innovative technology solutions, providing next-generation services and products across the globe.",
        phone: "+1234567890",
        email: "contact@techinnovations.com"
    });
    const [editable, setEditable] = useState(false);

    const handleEdit = () => {
        setEditable(!editable); // Toggle edit mode
    };

    const handleLogout = () => {
        console.log('Logout button tapped');
        // Here you would usually handle navigation to the login screen or logout logic
        // navigation.navigate('Login');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.bannerContainer}>
                <Image source={{ uri: companyProfile.logoUrl }} style={styles.banner} resizeMode="cover" />
                <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{editable ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
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
        justifyContent: 'flex-start', // Adjusted for content alignment at the start
        paddingVertical: 20,
    },
    bannerContainer: {
        width: '100%',
        marginBottom: 20, // Additional spacing
    },
    banner: {
        width: '100%',
        height: 200,
        marginBottom: 10, // Additional space below the banner
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
        minHeight: 100, // Allow room for multi-line input
    },
    editButton: {
        position: 'absolute',
        right: 10,
        top: 10, // Positioned to be visible and accessible
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 5,
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
    },
    logoutButton: {
        width: '80%',
        marginBottom: 20,
    }
});
