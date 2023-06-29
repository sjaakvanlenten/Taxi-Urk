import { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";

import * as Font from "expo-font";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

import useTaxiDriverContext from "../context/taxiDriver-context";
import { light } from "../themes/theme";
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

// Custom hook for retrieving the user ID from SecureStore
const useRetrieveUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const userId = await SecureStore.getItemAsync("user");
        setUserId(userId);
      } catch (error) {
        console.error(error);
      }
    };

    retrieveUserId();
  }, []);

  return userId;
};

const useLoadFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFontsAsync = async () => {
      try {
        await Font.loadAsync({
          "OpenSans-light": require("../assets/fonts/OpenSans/OpenSans-Light.ttf"),
          "OpenSans-regular": require("../assets/fonts/OpenSans/OpenSans-Regular.ttf"),
          "OpenSans-bold": require("../assets/fonts/OpenSans/OpenSans-Bold.ttf"),
          "OpenSans-medium": require("../assets/fonts/OpenSans/OpenSans-Medium.ttf"),
          "OpenSans-semibold": require("../assets/fonts/OpenSans/OpenSans-SemiBold.ttf"),
          "OpenSans-extrabold": require("../assets/fonts/OpenSans/OpenSans-ExtraBold.ttf"),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadFontsAsync();
  }, []);

  return fontsLoaded;
};

export default function AppBootstrap({ children }) {
  const [appIsReady, setAppIsReady] = useState(false);
  const { setTaxi } = useTaxiDriverContext();
  const userId = useRetrieveUserId();
  const fontsLoaded = useLoadFonts();

  useLayoutEffect(() => {
    const hideSplashScreen = async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [appIsReady]);

  useEffect(() => {
    const prepare = async () => {
      if (userId) {
        await fetchTaxiData(userId, setTaxi);
      }

      // Other initialization tasks can be added here

      setAppIsReady(true);
    };

    prepare();
  }, [userId, setTaxi]);

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={() => {}}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: light.primary,
    flex: 1,
  },
});
