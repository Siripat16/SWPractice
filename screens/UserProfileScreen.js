import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import defaultProfilePic from '../assets/user.png'; // Adjust the path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfileScreen({ navigation, route }) {
    
    const { userID, token } = route.params;
    const studentID = userID;
    const [imageUri, setImageUri] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [resume, setResume] = useState('');
    // const userID = '6627f6a38aa54820960b636e';
    // const navigation = useNavigation();


    useEffect(() => {
        requestMediaLibraryPermissions();
        fetchUserProfile(userID);
    }, [userID]);

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
                    profilePicture: imageUri,
                    resume: profileData.resume,
                });

                setName(profileData.name);
                setEmail(profileData.emailAddress);
                setPhoneNumber(profileData.telPhone);
                setResume(profileData.resume);

                // Format the resume text
                const formattedResume = profileData.resume.replace(/\\n/g, '\n');
                setResume(formattedResume);
            } else {
                console.error('No user data found:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    }

    async function uploadImage() {
        if (!imageUri) {
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
        } catch (error) {
            console.error("Error uploading image: ", error);
            Alert.alert('Upload Failed', 'Failed to upload image.');
        }
    }

    async function saveProfile() {
        try {
            const url = `http://127.0.0.1:2000/api/v1/auth/user/${studentID}`;
            const response = await axios.put(url, {
                name,
                emailAddress: email,
                telPhone: phoneNumber,
                resume: resume
            });

            if (response.data.success) {
                fetchUserProfile(studentID);
                setEditing(false);
                // Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
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

    const handleLogout = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:2000/api/v1/auth/logout', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          if (response.data.success) {
              await AsyncStorage.multiRemove(['userRole', 'userID', 'userToken']);
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
      <GestureHandlerRootView>
        <LinearGradient colors={['#4286f4', '#373B44']} style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>User Profile</Text>
                </View>
                
                {editing ? (
                    <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                        <Image source={imageUri ? { uri: imageUri } : (userProfile?.profilePicture ? { uri: userProfile.profilePicture } : defaultProfilePic)} style={styles.profileImage} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.profileImageContainer}>
                        <Image source={(userProfile?.profilePicture || imageUri) ? { uri: userProfile?.profilePicture || imageUri } : defaultProfilePic} style={styles.profileImage} />
                    </View>
                )}
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
                        <TextInput
                            style={[styles.input, styles.resumeInput]}
                            value={resume}
                            onChangeText={setResume}
                            placeholder="Resume"
                            placeholderTextColor="#ccc"
                            multiline={true}
                            numberOfLines={10} // Set the number of lines visible initially
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
                {!editing && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>Name: {userProfile?.name}</Text>
                        <Text style={styles.detailText}>Email: {userProfile?.email}</Text>
                        <Text style={styles.detailText}>Phone Number: {userProfile?.phoneNumber}</Text>
                        <Text style={styles.detailText}>
                          Experience
                        </Text>
                        <ScrollView style={styles.resumeScrollView}>
                            <Text style={styles.resumeText}>{resume}</Text>
                        </ScrollView>
                    </View>
                )}
            </View>
            <View style={styles.logoutButton}>
                <Button title="Logout" onPress={handleLogout} color="#D9534F" />
            </View>
        </LinearGradient>
      </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        alignItems: 'center',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
    },
    resumeText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left', // Align the text to the left
    },
    resumeScrollView: {
      maxHeight: 200, 
      width: '90%',
  },
  resumeInput: {
    height: 120, // Adjust as needed
    textAlignVertical: 'top', // Set text alignment to top
    marginBottom: 10,
},
logoutButton: {
  position: 'absolute',
  bottom: 50,
  alignSelf: 'center',
  width: '80%'
}
});
