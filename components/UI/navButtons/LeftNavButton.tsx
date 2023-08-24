import React from "react";
import { Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./navButton.styles";

type NavButtonProps = {
  buttonText: string;
};

const LeftNavButton = ({ buttonText }: NavButtonProps) => {
  return (
    <View style={[styles.pressableBox, { paddingRight: 15 }]}>
      <View
        style={{
          paddingLeft: 10,
          backgroundColor: "#181818",
          borderRadius: 25,
          height: 50,
          width: 60,
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "white",
        }}
      >
        <FontAwesome5 name="arrow-left" size={30} color="whitesmoke" />
      </View>

      <Text style={[styles.buttonText, { marginLeft: 15 }]}>{buttonText}</Text>
    </View>
  );
};

export default LeftNavButton;
