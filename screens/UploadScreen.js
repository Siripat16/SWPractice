import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function UploadScreen({ navigation }) {
    const [imageUri, setImageUri] = useState(null);
    const studentID = '661ff9e5774f23adaf3949cb';

    useEffect(() => {
        requestMediaLibraryPermissions();
    }, []);

    async function requestMediaLibraryPermissions() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri); // Corrected from setImage to setImageUri
        }
    };

    async function uploadImage() {
        if (!imageUri) {
            Alert.alert('No Image Selected', 'Please select an image first!');
            return;
        }

        const formData = new FormData();
        let filename = imageUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : 'image/jpeg'; // Improved to handle file type dynamically

        formData.append('file', {
            uri: imageUri,
            type: type, // Use dynamic type
            name: filename || 'upload.jpg' // Use dynamic filename or default
        });

        try {
            const response = await axios({
                url: `http://127.0.0.1:2000/api/v1/auth/user/${studentID}`, // Ensure you replace this with your actual backend endpoint
                method: 'PUT',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('Upload Successful', 'Image uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading image: ", error);
            Alert.alert('Upload Failed', 'Failed to upload image.');
        }
    }

    return (
        <View style={styles.container}>
            <Button title="Pick an Image" onPress={pickImage} />
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                />
            )}
            <Button title="Upload Image" onPress={uploadImage} color="green" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        margin: 10,
    },
});
