import { View, Text, StyleSheet } from 'react-native';

export default function UserProfileScreen() {

    return (
        <View style={styles.container}>
            <Text>User Profile Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    }
});