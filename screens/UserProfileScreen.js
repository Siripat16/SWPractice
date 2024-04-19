import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking, Alert, Platform } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function UserProfileScreen({ navigation }) {
    const userID = '661ff9e5774f23adaf3949cb';
    const [userProfile, setUserProfile] = useState({});
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [editable, setEditable] = useState(false);
    
    const validateFields = () => {
        const newErrors = {};
        // Validate name
        if (!userProfile.name) {
            newErrors.name = "Please add a name.";
        }
    
        // Validate email
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!userProfile.email) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(userProfile.email)) {
            newErrors.email = "Please enter a valid email.";
        }
    
        // Validate phone number
        if (!userProfile.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required.";
        } else if (userProfile.phoneNumber.length < 9) {
            newErrors.phoneNumber = "Phone number must be at least 9 digits.";
        }
    
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    useEffect(() => {
        validateFields();
    }, [userProfile.name, userProfile.email, userProfile.phoneNumber]);
    
    

    const fetchUserProfile = async (userID, setUserProfile) => {
        try {
            const url = `http://127.0.0.1:2000/api/v1/auth/user/${userID}`;
            // console.log('url1')
            // console.log(url)
            const response = await axios.get(url);
            // console.log(response.data)
            if (response.data.success && response.data.data) {
                const profileData = response.data.data;
                const imageUri = profileData.picture ? `data:image/jpeg;base64,${profileData.picture}` : null;
    
                setUserProfile({
                    name: profileData.name,
                    email: profileData.emailAddress,
                    phoneNumber: profileData.telPhone,
                    profilePicture: imageUri
                });
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };
    

    useEffect(() => {
        if (userID) {
            fetchUserProfile(userID, setUserProfile);
        } else {
            console.error('UserID is missing');
        }
    }, [userID]);


    

    const handleEdit = async () => {
        if (editable) {
            // When toggling from editable to non-editable, save the data
            await saveProfileData();
        }
        setEditable(!editable);
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

    //Upload Image
    // Request permission in useEffect when the component mounts
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        console.log(result); // Log the result to inspect its structure
    
        // Check if the result is not cancelled and assets array is present and not empty
        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri; // Get the URI from the first asset
            console.log(uri); // Log the URI to confirm it's correct
    
            setImage(uri); // Update the image state for the preview
            setUserProfile({
                ...userProfile,
                profilePicture: uri // Update userProfile state with the new image URI
            });
        }
    };
    

    const saveProfileData = async () => {
        const formData = new FormData();
        formData.append('name', userProfile.name);
        formData.append('emailAddress', userProfile.email);
        formData.append('telPhone', userProfile.phoneNumber);
        
        // Include the image only if it has been changed
        if (image && image !== userProfile.profilePicture) {
            let localUri = image;
            let filename = localUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
    
            formData.append('profilePicture', { uri: localUri, name: filename, type });
        }
    
        try {
            const url = `http://127.0.0.1:2000/api/v1/auth/user/${userID}`;
            const response = await axios.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                console.log('Profile updated successfully!');
                setUserProfile(response.data.data);
            }
            fetchUserProfile(userID, setUserProfile);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };
    


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                onPress={handleEdit}
                style={styles.editButton}
                disabled={!isFormValid}  // Disable the button if the form is not valid
            >
                <Text style={[
                    styles.editButtonText,
                    !isFormValid ? styles.disabledText : {}  // Change text color when disabled
                ]}>
                    {editable ? 'Save' : 'Edit'}
                </Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={editable ? pickImage : undefined}>
                <Image source={{ uri: userProfile.profilePicture || 'default_image_uri_here' }} style={styles.profilePic} />
            </TouchableOpacity>

            {editable ? (
                <>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setUserProfile({...userProfile, name: text})}
                        value={userProfile.name}
                        placeholder="Name"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </>
            ) : (
                <Text style={styles.nameText}>{userProfile.name}</Text>
            )}

            {editable ? (
                <>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setUserProfile({...userProfile, phoneNumber: text})}
                        keyboardType="phone-pad"
                        value={userProfile.phoneNumber}
                        placeholder="Phone Number"
                    />
                    {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                </>
            ) : (
                <Text style={styles.infoText}>{userProfile.phoneNumber}</Text>
            )}

            {editable ? (
                <>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setUserProfile({...userProfile, email: text})}
                        value={userProfile.email}
                        placeholder="Email"
                        keyboardType="email-address"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </>
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
        justifyContent: 'flex-start', // Start aligning content from the top
        paddingTop: 50, // Reduced padding at the top
        paddingBottom: 20,
        gap: 5,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 20, // Adding a bit of top margin to elevate from the very top
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5, // Reduced to tighten the layout
    },
    nameText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
        fontWeight: 'bold', // Apply bold font weight
    },    
    input: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5, // Tightening the input layout
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: '90%', // Increased width for better appearance
        borderRadius: 5,
    },
    editButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 8,
        // backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    editButtonText: {
        color: '#0000EE',
        textDecorationLine: 'underline', // Ensure text is underlined
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
        position: 'absolute',
        bottom: 20, // Lower to ensure it's not too low on devices
        alignSelf: 'center',
        width: '90%', // Make button wider for better touch area
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginBottom: 5,
    },
    editButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 8,
        backgroundColor: 'transparent',
        borderRadius: 5,
    },
    editButtonText: {
        textDecorationLine: 'underline',
        fontSize: 16,
        color: '#0000EE',  // Default active color (blue)
    },
    disabledText: {
        color: '#CCCCCC'  // Gray color for disabled state
    },
});
