import { useState, useEffect, useLayoutEffect } from "react";
import { View, Text } from "react-native";

import * as Font from "expo-font";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

import useTaxiDriverContext from "../context/taxiDriver-context";
import { child, get } from "firebase/database";
import { taxisRef } from "../firebase/queries";
import { Taxi } from "../types/typings";

SplashScreen.preventAutoHideAsync();

const fetchTaxiData = async (taxiId: string, setTaxi: (taxi: Taxi) => void) => {
  try {
    const snapshot = await get(child(taxisRef, `/${taxiId}`));
    if (snapshot.exists()) {
      const taxi: Taxi = snapshot.val();
      taxi.id = snapshot.key;
      setTaxi(taxi);
    } else {
      console.log("Gegevens zijn niet bekend");
    }
  } catch (error) {
    console.error(error);
  }
};

export default function AppBootstrap({ children }) {
  const { setTaxi } = useTaxiDriverContext();
  const [isAppReady, setIsAppReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // New state for error message

  useLayoutEffect(() => {
    const hideSplashScreen = async () => {
      if (isAppReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [isAppReady]);

  useEffect(() => {
    const prepare = async () => {
      try {
        const userId = await SecureStore.getItemAsync("user");
        await fetchTaxiData(userId, setTaxi);

        await Font.loadAsync({
          "OpenSans-light": require("../assets/fonts/OpenSans/OpenSans-Light.ttf"),
          "OpenSans-regular": require("../assets/fonts/OpenSans/OpenSans-Regular.ttf"),
          "OpenSans-bold": require("../assets/fonts/OpenSans/OpenSans-Bold.ttf"),
          "OpenSans-medium": require("../assets/fonts/OpenSans/OpenSans-Medium.ttf"),
          "OpenSans-semibold": require("../assets/fonts/OpenSans/OpenSans-SemiBold.ttf"),
          "OpenSans-extrabold": require("../assets/fonts/OpenSans/OpenSans-ExtraBold.ttf"),
        });

        setIsAppReady(true);
      } catch (error) {
        console.error(error);
        setErrorMessage("Er is een fout opgetreden, probeer het nog een keer");
      }
    };

    prepare();
  }, []);

  if (errorMessage) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  if (!isAppReady) {
    return null;
  }

  return <>{children}</>;
}
