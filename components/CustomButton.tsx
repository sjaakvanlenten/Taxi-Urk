import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ColorValue,
} from "react-native";
import React, { ReactNode } from "react";
import { light } from "../themes/theme";

interface ButtonProps extends PressableProps {
  children?: ReactNode;
  onPressHandler?: (event: GestureResponderEvent) => void;
  active?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  width?: number | string;
  height?: number | string;
  color?: string;
  icon?: ReactNode;
  rippleColor?: ColorValue;
}

const CustomButton = ({
  children,
  onPressHandler,
  active = true,
  buttonStyle,
  buttonTextStyle,
  width,
  height,
  color,
  icon,
  rippleColor,
}: ButtonProps) => {
  const activeButtonStyle = active
    ? styles.activeButton
    : styles.disabledButton;
  const activeTextStyle = active ? styles.activeText : styles.disabledText;

  const buttonStyles = [
    styles.buttonContainer,
    activeButtonStyle,
    {
      width: width || "auto",
      height: height || "auto",
    },
    active && color && { backgroundColor: color },
    buttonStyle,
  ];

  const buttonTextStyles = [
    styles.buttonText,
    activeTextStyle,
    buttonTextStyle,
  ];

  return (
    <View style={buttonStyles}>
      <Pressable
        android_ripple={{ borderless: true, color: rippleColor }}
        style={styles.button}
        onPress={onPressHandler}
        disabled={!active}
      >
        {icon && icon}
        <Text style={buttonTextStyles}>{children}</Text>
      </Pressable>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    elevation: 1,
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: light.black,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    borderColor: "#999999",
  },
  buttonText: {
    fontFamily: "OpenSans-medium",
  },
  activeText: {
    color: "whitesmoke",
  },
  disabledText: {
    color: "#666666",
  },
});
