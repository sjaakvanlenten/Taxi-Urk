import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MenuButton from "./buttons/MenuButton";
import { colors } from "../themes/light";
import { Ionicons } from "@expo/vector-icons";

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
  radius: 25,
};

const TopMenu: React.FC<TopMenuProps> = (children) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(menuExpanded ? MARGIN : 0);
  }, [menuExpanded]);

  const animatedButtonStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedButtonStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 2 }],
  }));

  const animatedButtonStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 3 }],
  }));

  const animatedButtonStyle4 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 4 }],
  }));

  return (
    <View
      style={[
        styles.menuContainer,
        { position: "absolute", top: 30, left: MENU_HORIZONTAL_OFFSET },
      ]}
    >
      <MenuButton isPressed={menuExpanded} setIsPressed={setMenuExpanded} />

      <AnimatedPressable
        style={[
          styles.button,
          animatedButtonStyle1,
          { elevation: menuExpanded ? 10 : 0 },
        ]}
        android_ripple={{ ...rippleConfig }}
      >
        <Ionicons name="md-settings-sharp" size={32} color="white" />
      </AnimatedPressable>

      <AnimatedPressable
        style={[
          styles.button,
          animatedButtonStyle2,
          { elevation: menuExpanded ? 10 : 0 },
        ]}
        android_ripple={{ ...rippleConfig }}
      >
        <Ionicons name="md-settings-sharp" size={32} color="white" />
      </AnimatedPressable>
      <AnimatedPressable
        style={[
          styles.button,
          animatedButtonStyle3,
          { elevation: menuExpanded ? 10 : 0 },
        ]}
        android_ripple={{ ...rippleConfig }}
      >
        <Ionicons name="md-settings-sharp" size={32} color="white" />
      </AnimatedPressable>
      <AnimatedPressable
        style={[
          styles.button,
          animatedButtonStyle4,
          { elevation: menuExpanded ? 10 : 0 },
        ]}
        android_ripple={{ ...rippleConfig }}
      >
        <Ionicons name="md-settings-sharp" size={32} color="white" />
      </AnimatedPressable>
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
  button: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
