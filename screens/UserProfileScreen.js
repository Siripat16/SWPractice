import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function UserProfileScreen({ navigation }) {
    const studentID = '661ff9e5774f23adaf3949cb';
    const [imageUri, setImageUri] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const userID = '661ff9e5774f23adaf3949cb';

    useEffect(() => {
        requestMediaLibraryPermissions();
        fetchUserProfile(userID);
    }, []);

    async function requestMediaLibraryPermissions() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission denied for media library');
        }
    }

    async function fetchUserProfile(userID) {
        try {
            const url = `http://127.0.0.1:2000/api/v1/auth/user/${userID}`;
            const response = await axios.get(url);
            if (response.data.success && response.data.data) {
                const profileData = response.data.data;
                const imageUri = profileData.picture ? `data:image/jpeg;base64,${profileData.picture}` : null;

                setUserProfile({
                    name: profileData.name,
                    email: profileData.emailAddress,
                    phoneNumber: profileData.telPhone,
                    profilePicture: imageUri
                });

                // Initialize name, email, and phone number state with fetched data
                setName(profileData.name);
                setEmail(profileData.emailAddress);
                setPhoneNumber(profileData.telPhone);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    }

    async function uploadImage() {
        if (!imageUri) {
            // Alert.alert('No Image Selected', 'Please select an image first!');
            return;
        }

        const formData = new FormData();
        let filename = imageUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : 'image/jpeg'; 

        formData.append('file', {
            uri: imageUri,
            type: type, 
            name: filename || 'upload.jpg'
        });

        try {
            const response = await axios({
                url: `http://127.0.0.1:2000/api/v1/auth/user/${studentID}`,
                method: 'PUT',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Alert.alert('Upload Successful', 'Image uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading image: ", error);
            Alert.alert('Upload Failed', 'Failed to upload image.');
        }
    }

    async function saveProfile() {
        // Perform validation here if needed
    
        // Send updated profile data to the server
        try {
            const url = `http://127.0.0.1:2000/api/v1/auth/user/${studentID}`;
            const response = await axios.put(url, {
                name,
                email,
                phoneNumber
            });
    
            if (response.data.success) {
                // Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
                // Refresh profile data after successful update
                // Toast.show({
                //     text: 'Hello, this is a toast!',
                //     duration: Toast.durations.SHORT,
                //   });
                fetchUserProfile(studentID);
                setEditing(false); // Exit editing mode after successful update
            } else {
                Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
        }
    };

    return (
        <LinearGradient colors={['#4286f4', '#373B44']} style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>User Profile</Text>
                </View>
                <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.profileImage} />
                    ) : (
                        <Image source={{ uri: userProfile?.profilePicture }} style={styles.profileImage} />
                    )}
                </TouchableOpacity>
                {!editing && (
                    <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                )}
                {editing && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Name"
                            placeholderTextColor="#ccc"
                        />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="#ccc"
                        />
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Phone Number"
                            placeholderTextColor="#ccc"
                        />
                        <TouchableOpacity onPress={() => {
                            saveProfile();
                            uploadImage();
                            setEditing(false);
                        }} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* Display user details */}
                {!editing && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>Name: {userProfile?.name}</Text>
                        <Text style={styles.detailText}>Email: {userProfile?.email}</Text>
                        <Text style={styles.detailText}>Phone Number: {userProfile?.phoneNumber}</Text>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        paddingTop: 35,
        alignItems: 'center',
    },
    contentContainer: {
        width: '90%',
        maxWidth: 400,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileImageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        marginBottom: 20,
    },
    profileImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    editButton: {
        backgroundColor: '#4286f4',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#f3f3f3',
    },
    saveButton: {
        backgroundColor: '#4286f4',
        width: '100%',
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    detailsContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
    },
});
