import { StyleSheet } from "react-native";
import { light } from "../../../themes/theme";

const styles = StyleSheet.create({
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
    color: light.black,
    fontSize: 18,
  },
});

export default styles;
