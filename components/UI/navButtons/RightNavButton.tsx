import React from "react";
import { Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./navButton.styles";

type NavButtonProps = {
  buttonText: string;
};

const RightNavButton = ({ buttonText }: NavButtonProps) => {
  return (
    <View style={[styles.pressableBox, { paddingLeft: 15 }]}>
      <Text style={[styles.buttonText, { marginRight: 15 }]}>{buttonText}</Text>
      <View
        style={{
          alignItems: "flex-end",
          paddingRight: 10,
          backgroundColor: "#181818",
          borderRadius: 25,
          borderWidth: 1,
          borderColor: "white",
          height: 50,
          width: 60,
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name="arrow-right" size={30} color="whitesmoke" />
      </View>
    </View>
  );
};

export default RightNavButton;
