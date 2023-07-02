import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import { useEffect, useState, Children, FC, ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MenuButton from "./buttons/MenuButton";

type TopMenuProps = {
  children?: ReactNode;
  backgroundColor: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MENU_HORIZONTAL_OFFSET = 10;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MENU_WIDTH = SCREEN_WIDTH - MENU_HORIZONTAL_OFFSET * 2;

const rippleConfig = {
  borderless: true,
  color: "#de932c",
  radius: 25,
};

const TopMenu: FC<TopMenuProps> = ({ children, backgroundColor }) => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const translateX = useSharedValue(0);
  const MARGIN = (MENU_WIDTH - 50) / Children.count(children);

  useEffect(() => {
    translateX.value = withTiming(menuExpanded ? MARGIN : 0);
  }, [menuExpanded]);

  const animatedButtonStyles = Children.map(children, (_, index) =>
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
      {Children.map(children, (child, index) => (
        <AnimatedPressable
          key={index}
          style={[
            styles.menuButton,
            animatedButtonStyles[index],
            {
              elevation: menuExpanded ? 10 : 0,
              backgroundColor: backgroundColor,
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
