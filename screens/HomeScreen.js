import { View, Text, StyleSheet, Button } from "react-native";

//Navigation hook for other component that needs redirection
// import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({ navigation, route }) {
    //Navigation hook
    // const navigation = useNavigation()
    const { userRole } = route.params;
    return (
        <View style={styles.container}>
            <Text>User Role: {userRole} </Text>
            <Text style={styles.text}>Home Screen</Text>
            <Button 
                title="Go to Dashboard" 
                onPress={ () => {navigation.navigate('Dashboard', {
                    name: "Dashboard"
                })}} 
            />
            <Button 
                title="Go to Event" 
                onPress={ () => {navigation.navigate('Event', {
                    name: "Event"
                })}} 
            />
            <Button 
                title="Go to Booking" 
                onPress={ () => {navigation.navigate('Booking', {
                    name: "Booking"
                })}} 
            />
            <Button 
                title="Go to Login" 
                onPress={ () => {navigation.navigate('Login', {
                    name: "Login"
                })}} 
            />
            <Button 
                title="Go to Register" 
                onPress={ () => {navigation.navigate('Register', {
                    name: "Register"
                })}} 
            />
            <Button 
                title="Go to UserProfile" 
                onPress={ () => {navigation.navigate('UserProfile', {
                    name: "UserProfile"
                })}} 
            />
            <Button 
                title="Go to CompanyProfile" 
                onPress={ () => {navigation.navigate('CompanyProfile', {
                    name: "CompanyProfile"
                })}} 
            />
            <Button 
                title="Manage Resume (ไม่ใช้แล้ว จะลบ)" 
                onPress={ () => {navigation.navigate('ManageResume', {
                    name: "ManageResume"
                })}} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
