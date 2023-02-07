import { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import useTaxiDriverContext from "../context/taxiDriver-context";

SplashScreen.preventAutoHideAsync();

export default function AppBootstrap({ children }) {
  const [appIsReady, setAppIsReady] = useState(false);
  const { setTaxiId } = useTaxiDriverContext();

  useEffect(() => {
    const getTaxiId = async () => {
      try {
        const value = await AsyncStorage.getItem("@user");
        if (value !== null) {
          setTaxiId(value);
        }
      } catch (e) {
        // error reading value
      } finally {
        setAppIsReady(true);
      }
    };

    getTaxiId();
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
    flex: 1,
    backgroundColor: "whitesmoke",
  },
});
