import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  Dimensions,
  Image,
} from "react-native";
import { useLayoutEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../navigation/types";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../themes/light";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const WelcomeScreen = () => {
  const navigation =
    useNavigation<RootStackScreenProps<"Welcome">["navigation"]>();

  const translate_X_Right = useSharedValue(-100);
  const translate_X_Left = useSharedValue(SCREEN_WIDTH);

  function animateLeft(componentWidth: number) {
    translate_X_Left.value = withTiming(25, {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }

  function animateRight(componentWidth: number) {
    translate_X_Right.value = withTiming(SCREEN_WIDTH - componentWidth - 25, {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }

  const rLeftButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translate_X_Left.value,
        },
      ],
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
        <View>
          {/* <Animated.Image
            source={require("../assets/searchTaxi.png")}
            style={[
              rRightButtonStyle,
              { width: 120, height: 120, marginBottom: 20 },
            ]}
            onLayout={(event) => {
              animate(event.nativeEvent.layout.width);
            }}
          /> */}
          <AnimatedPressable
            style={[
              styles.pressableBox,
              rLeftButtonStyle,
              { paddingRight: 15 },
            ]}
            onPress={() => navigation.navigate("ClientHome")}
            onLayout={(event) => {
              animateLeft(event.nativeEvent.layout.width);
            }}
          >
            <View
              style={{
                paddingLeft: 10,
                backgroundColor: "#181818",
                borderRadius: 25,
                height: 50,
                width: 60,
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="arrow-left" size={30} color="whitesmoke" />
            </View>

            <Text style={[styles.buttonText, { marginLeft: 15 }]}>
              Ik zoek een Taxi
            </Text>
          </AnimatedPressable>
        </View>
        <View>
          {/* <Animated.Image
            source={require("../assets/searchTaxi.png")}
            style={[rRightButtonStyle, { width: 120, height: 120 }]}
          /> */}
          <AnimatedPressable
            style={[
              styles.pressableBox,
              rRightButtonStyle,
              { paddingLeft: 15 },
            ]}
            onPress={() => navigation.navigate("CreateNewTaxi")}
            onLayout={(event) => {
              animateRight(event.nativeEvent.layout.width);
            }}
          >
            <Text style={[styles.buttonText, { marginRight: 15 }]}>
              Ik ben een Taxi
            </Text>
            <View
              style={{
                alignItems: "flex-end",
                paddingRight: 10,
                backgroundColor: "#181818",
                borderRadius: 25,
                height: 50,
                width: 60,
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="arrow-right" size={30} color="whitesmoke" />
            </View>
          </AnimatedPressable>
        </View>
      </View>

      <StatusBar backgroundColor={colors.black} style="light" />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "80%",
    justifyContent: "space-around",
  },
  pressableBox: {
    backgroundColor: "whitesmoke",
    borderRadius: 25,
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "OpenSans-semibold",
    color: colors.black,
    fontSize: 18,
  },
});
