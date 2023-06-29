import { useState, useEffect, useCallback } from "react";
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

export default function AppBootstrap({ children }) {
  const [appIsReady, setAppIsReady] = useState(false);
  const { setTaxi } = useTaxiDriverContext();

  useEffect(() => {
    async function prepare() {
      try {
        const taxiId = await SecureStore.getItemAsync("user");
        if (taxiId !== null) {
          await get(child(taxisRef, `/${taxiId}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                const taxi: Taxi = snapshot.val();
                taxi.id = snapshot.key;
                setTaxi(taxi);
              } else {
                console.log("Gegevens zijn niet bekend");
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }

        await Font.loadAsync({
          "OpenSans-light": require("../assets/fonts/OpenSans/OpenSans-Light.ttf"),
          "OpenSans-regular": require("../assets/fonts/OpenSans/OpenSans-Regular.ttf"),
          "OpenSans-bold": require("../assets/fonts/OpenSans/OpenSans-Bold.ttf"),
          "OpenSans-medium": require("../assets/fonts/OpenSans/OpenSans-Medium.ttf"),
          "OpenSans-semibold": require("../assets/fonts/OpenSans/OpenSans-SemiBold.ttf"),
          "OpenSans-extrabold": require("../assets/fonts/OpenSans/OpenSans-ExtraBold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
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
