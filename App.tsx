import "expo-dev-client";
import { ReactElement } from "react";
import AppBootstrap from "./components/app-bootstrap";
import { TaxiDriverProvider } from "./context/taxiDriver-context";
import Navigator from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./context/theme-context";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App(): ReactElement {
  return (
    <RootSiblingParent>
      <TaxiDriverProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppBootstrap>
              <Navigator />
            </AppBootstrap>
          </ThemeProvider>
        </SafeAreaProvider>
      </TaxiDriverProvider>
    </RootSiblingParent>
  );
}
