import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import React, { ReactNode } from "react";
import { colors } from "../themes/light";

interface ButtonProps {
  children: ReactNode;
  onPressHandler: (event: GestureResponderEvent) => void;
  active?: boolean;
}

const CustomButton = ({
  children,
  onPressHandler,
  active = true,
}: ButtonProps) => {
  const activeButtonStyle = active
    ? styles.activeButton
    : styles.disabledButton;

  const activeTextStyle = active ? styles.activeText : styles.disabledText;
  return (
    <Pressable
      style={[styles.button, activeButtonStyle]}
      onPress={onPressHandler}
      disabled={!active}
    >
      <Text style={[styles.buttonText, activeTextStyle]}>{children}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: colors.black,
  },
  disabledButton: {
    backgroundColor: "white",
    borderColor: "#bababa",
    borderWidth: 2,
  },
  buttonText: {
    fontFamily: "OpenSans-semibold",

    fontSize: 15,
  },
  activeText: {
    color: "whitesmoke",
  },
  disabledText: {
    color: "#bababa",
  },
});
