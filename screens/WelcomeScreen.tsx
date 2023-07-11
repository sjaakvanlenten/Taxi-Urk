import { StyleSheet, View, Pressable, Dimensions } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../navigation/types";
import { StatusBar } from "expo-status-bar";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { light } from "../themes/theme";
import LeftNavButton from "../components/buttons/navButtons/LeftNavButton";
import RightNavButton from "../components/buttons/navButtons/RightNavButton";

enum Direction {
  left,
  right,
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation =
    useNavigation<RootStackScreenProps<"Welcome">["navigation"]>();

  const translate_X_Right = useSharedValue(-100);
  const translate_X_Left = useSharedValue(SCREEN_WIDTH);

  function animate(direction: Direction, componentWidth?: number) {
    if (direction == Direction.left) {
      translate_X_Left.value = withTiming(25, {
        duration: 350,
      });
    }
    if (direction == Direction.right) {
      translate_X_Right.value = withTiming(SCREEN_WIDTH - componentWidth - 25, {
        duration: 350,
      });
    }
  }

  const rLeftButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translate_X_Left.value }],
    };
  });

  const rRightButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translate_X_Right.value,
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={styles.container}>
        <Animated.View style={rLeftButtonStyle}>
          <Pressable
            onPress={() => navigation.navigate("ClientHome")}
            onLayout={() => {
              animate(Direction.left);
            }}
            testID="leftButton"
          >
            <LeftNavButton buttonText="Ik zoek een Taxi" />
          </Pressable>
        </Animated.View>
        <Animated.View style={[rRightButtonStyle, { alignSelf: "flex-start" }]}>
          <Pressable
            onPress={() => navigation.navigate("CreateNewTaxi")}
            onLayout={(event) => {
              animate(Direction.right, event.nativeEvent.layout.width);
            }}
            testID="rightButton"
          >
            <RightNavButton buttonText="Ik ben een Taxi" />
          </Pressable>
        </Animated.View>
      </View>

      <StatusBar backgroundColor={light.black} style="light" />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "80%",
    justifyContent: "space-around",
  },
});
