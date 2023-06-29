import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MenuButton from "./buttons/MenuButton";
import useTheme from "../context/theme-context";

type TopMenuProps = {
  children?: React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MENU_HORIZONTAL_OFFSET = 10;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MENU_WIDTH = SCREEN_WIDTH - MENU_HORIZONTAL_OFFSET * 2;

const MARGIN = (MENU_WIDTH - 50) / 4;

const rippleConfig = {
  borderless: true,
  color: "#de932c",
  radius: 25,
};

const TopMenu: React.FC<TopMenuProps> = ({ children }) => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const { theme } = useTheme();

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(menuExpanded ? MARGIN : 0);
  }, [menuExpanded]);

  const animatedButtonStyles = React.Children.map(children, (child, index) =>
    useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value * (index + 1) }],
    }))
  );

  return (
    <View
      style={[
        styles.menuContainer,
        { position: "absolute", top: 30, left: MENU_HORIZONTAL_OFFSET },
      ]}
    >
      <MenuButton isPressed={menuExpanded} setIsPressed={setMenuExpanded} />
      {React.Children.map(children, (child, index) => (
        <AnimatedPressable
          key={index}
          style={[
            styles.menuButton,
            animatedButtonStyles[index],
            {
              elevation: menuExpanded ? 10 : 0,
              backgroundColor: theme.background,
            },
          ]}
          android_ripple={{ ...rippleConfig }}
        >
          {child}
        </AnimatedPressable>
      ))}
    </View>
  );
};

export default TopMenu;

const styles = StyleSheet.create({
  menuContainer: {
    width: MENU_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    height: 50,
    zIndex: 1,
    borderRadius: 25,
  },
  menuButton: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
