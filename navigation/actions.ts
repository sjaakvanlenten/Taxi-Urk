import { CommonActions } from "@react-navigation/native";
import { RootStackParamList, RootStackScreenProps } from "./types";

export const resetNavigationState = (
  navigation: RootStackScreenProps<keyof RootStackParamList>["navigation"],
  paramsObject: {} | undefined
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: "TaxiHome", params: paramsObject }],
    })
  );
};
