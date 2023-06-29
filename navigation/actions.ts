import { CommonActions } from "@react-navigation/native";
import { RootStackParamList, RootStackScreenProps } from "./types";

export const resetNavigationState = (
  navigation: RootStackScreenProps<keyof RootStackParamList>["navigation"]
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: "TaxiHome" }],
    })
  );
};
