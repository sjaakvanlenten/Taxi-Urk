import { Pressable } from "react-native";
import { useRef, Dispatch, SetStateAction } from "react";
import { light, dark } from "../../themes/theme";
import LottieView from "lottie-react-native";

type MenuButtonProps = {
  isPressed: boolean;
  setIsPressed: Dispatch<SetStateAction<boolean>>;
};

const MenuButton = ({ isPressed, setIsPressed }: MenuButtonProps) => {
  const animationRef = useRef<LottieView>(null);

  const menuPress = () => {
    isPressed
      ? animationRef.current?.play(30, 0)
      : animationRef.current?.play(0, 30);
    setIsPressed((state) => !state);
  };
  console.log(isPressed);
  return (
    <Pressable
      style={{
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: isPressed
          ? dark.listItemBackground
          : dark.iconBackGround,

        zIndex: 2,
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
      }}
      android_ripple={{ radius: 28 }}
      onPress={menuPress}
    >
      <LottieView
        source={require("../../assets/lottie/33655-back-icon.json")}
        loop={false}
        ref={animationRef}
        speed={2}
        style={{
          transform: [{ scale: 1.2 }, { translateY: 1 }],
        }}
        colorFilters={[
          {
            keypath: "Path",
            color: isPressed ? dark.textColor : light.black,
          },
        ]}
      />
    </Pressable>
  );
};

export default MenuButton;
