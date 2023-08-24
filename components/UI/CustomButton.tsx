import { FC, ReactNode } from "react";
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
  DimensionValue,
} from "react-native";

import { light } from "../../themes/theme";

interface ButtonProps extends PressableProps {
  children?: ReactNode;
  onPressHandler?: (event: GestureResponderEvent) => void;
  active?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  width?: DimensionValue;
  height?: DimensionValue;
  elevation?: number;
  color?: ColorValue;
  icon?: ReactNode;
  rippleColor?: ColorValue;
}

const CustomButton: FC<ButtonProps> = ({
  children,
  onPressHandler,
  active = true,
  buttonStyle,
  buttonTextStyle,
  width,
  height,
  elevation,
  color,
  icon,
  rippleColor,
}) => {
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
      elevation: elevation || 0,
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
    justifyContent: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: light.black,
  },
  disabledButton: {
    backgroundColor: "#DDDDDD",
    borderColor: "#999999",
    borderWidth: 1,
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
