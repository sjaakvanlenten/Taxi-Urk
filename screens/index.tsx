import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../navigation/types";

const WelcomeScreen = () => {
  const navigation =
    useNavigation<RootStackScreenProps<"Welcome">["navigation"]>();
  return (
    <View style={styles.container}>
      <View style={{ height: 200, justifyContent: "space-between" }}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("ClientHome")}
        >
          <Text style={styles.buttonText}>Ik zoek een Taxi</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("CreateNewTaxi")}
        >
          <Text style={styles.buttonText}>Ik ben een Taxi</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("TestingScreen")}
        >
          <Text style={styles.buttonText}>Test suite</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 50,
    backgroundColor: "royalblue",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 16,
  },
});
