import { Dimensions, StyleSheet, View } from "react-native";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors } from "../themes/light";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type BottomSheetProps = {
  children: React.ReactNode;
  stateHandler: Dispatch<SetStateAction<boolean>>;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BOTTOMSHEET_OFFSET = 0;

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT / 2 + 100 + BOTTOMSHEET_OFFSET;

const DISTANCE_TO_SWIPE = 100;

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  stateHandler,
}) => {
  const translateY = useSharedValue(0);

  const context = useSharedValue({ y: 0 });

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    destination < 0
      ? runOnJS(stateHandler)(true)
      : runOnJS(stateHandler)(false);
    translateY.value = withSpring(destination, {
      damping: 50,
    });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      if (event.absoluteY < SCREEN_HEIGHT / 2 - BOTTOMSHEET_OFFSET) {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      }
    })
    .onEnd(() => {
      if (context.value.y <= MAX_TRANSLATE_Y + DISTANCE_TO_SWIPE) {
        if (translateY.value > MAX_TRANSLATE_Y + DISTANCE_TO_SWIPE) {
          scrollTo(0);
        } else {
          scrollTo(MAX_TRANSLATE_Y);
        }
      } else if (translateY.value > -DISTANCE_TO_SWIPE) {
        scrollTo(0);
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    const height = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [SCREEN_HEIGHT / 2, SCREEN_HEIGHT - 100]
    );
    return {
      borderTopRightRadius: borderRadius,
      borderTopLeftRadius: borderRadius,
      height,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        { top: SCREEN_HEIGHT / 2 - BOTTOMSHEET_OFFSET },
        styles.bottomSheetContainer,
        rBottomSheetStyle,
      ]}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ height: 25, justifyContent: "center" }}>
          <View style={styles.line} />
        </Animated.View>
      </GestureDetector>
      {children}
    </Animated.View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    width: SCREEN_WIDTH,
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    position: "absolute",
    elevation: 10,
  },
  line: {
    width: 65,
    height: 6,
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 5,
  },
});
