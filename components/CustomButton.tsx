import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";

const CustomButton = ({ children, onPressHandler }) => {
  return (
    <Pressable style={styles.button} onPress={onPressHandler}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
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
