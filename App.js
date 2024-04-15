import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Button,
  Pressable,
  Modal,
  StatusBar,
  SectionListComponent,
} from "react-native";
import { useState } from "react";
const logoImg = require("./assets/adaptive-icon.png");

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "plum", padding: 60 }}>
      <StatusBar backgroundColor="lightgreen" barStyle="dark-content" />
      <ScrollView>
        <Image source={logoImg} style={{ width: 300, height: 300 }} />
        <Button
          title="Press"
          onPress={() => setModalVisible(true)}
          color="midnightblue"
        />
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="fade"
          presentationStyle="pageSheet">
          <View style={{ flex: 1, backgroundColor: "lightblue", padding: 60 }}>
            <Text>Model Content</Text>
            <Button
              title="Close"
              color="midnightblue"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
