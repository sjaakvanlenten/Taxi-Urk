import { Dimensions, StyleSheet, View } from "react-native";
import { useCallback, ReactNode } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import useTheme from "../context/theme-context";

type BottomSheetProps = {
  children: ReactNode;
  onStateChange: (isExpanded: boolean) => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BOTTOMSHEET_OFFSET = 60;

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT / 2 + 100;

const DISTANCE_TO_SWIPE = 100;

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  onStateChange,
}) => {
  const { theme } = useTheme();

  const translateY = useSharedValue(0);

  const context = useSharedValue({ y: 0 });

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    destination < 0
      ? runOnJS(onStateChange)(true) // expanded
      : runOnJS(onStateChange)(false);
    translateY.value = withSpring(destination, {
      damping: 50,
    });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      if (translateY.value < 0)
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      if (translateY.value > 0)
        translateY.value = Math.min(
          translateY.value,
          -MAX_TRANSLATE_Y + BOTTOMSHEET_OFFSET
        );
    })
    .onEnd(() => {
      const shouldScrollToMax = translateY.value < 0;
      const shouldScrollToMin = translateY.value > 0;

      if (shouldScrollToMax) {
        if (context.value.y <= MAX_TRANSLATE_Y + DISTANCE_TO_SWIPE) {
          scrollTo(
            translateY.value > MAX_TRANSLATE_Y + DISTANCE_TO_SWIPE
              ? 0
              : MAX_TRANSLATE_Y
          );
        } else {
          scrollTo(translateY.value > -DISTANCE_TO_SWIPE ? 0 : MAX_TRANSLATE_Y);
        }
      }

      if (shouldScrollToMin) {
        if (
          context.value.y >=
          -MAX_TRANSLATE_Y + BOTTOMSHEET_OFFSET - DISTANCE_TO_SWIPE
        ) {
          scrollTo(
            translateY.value <
              -MAX_TRANSLATE_Y + BOTTOMSHEET_OFFSET - DISTANCE_TO_SWIPE
              ? 0
              : -MAX_TRANSLATE_Y + BOTTOMSHEET_OFFSET
          );
        } else {
          scrollTo(
            translateY.value < DISTANCE_TO_SWIPE
              ? 0
              : -MAX_TRANSLATE_Y + BOTTOMSHEET_OFFSET
          );
        }
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
      [SCREEN_HEIGHT / 2, SCREEN_HEIGHT - 100],
      Extrapolate.CLAMP
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
        {
          top: SCREEN_HEIGHT / 2,
          backgroundColor: theme.background,
        },
        styles.bottomSheetContainer,
        rBottomSheetStyle,
      ]}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ height: 25, justifyContent: "center" }}>
          <View
            style={[
              styles.line,
              {
                backgroundColor: theme.bottomSheetLine,
              },
            ]}
          />
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
