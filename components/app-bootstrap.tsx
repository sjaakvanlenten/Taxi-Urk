import { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";

import * as SplashScreen from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import useTaxiDriverContext from "../context/taxiDriver-context";
import { colors } from "../themes/light";

SplashScreen.preventAutoHideAsync();

export default function AppBootstrap({ children }) {
  const [appIsReady, setAppIsReady] = useState(false);
  const { setTaxiId } = useTaxiDriverContext();

  useEffect(() => {
    async function prepare() {
      try {
        const value = await AsyncStorage.getItem("@user");
        if (value !== null) {
          setTaxiId(value);
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
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
  },
});
