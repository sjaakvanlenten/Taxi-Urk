import "expo-dev-client";
import { ReactElement } from "react";
import AppBootstrap from "./components/app-bootstrap";
import { TaxiDriverProvider } from "./context/taxiDriver-context";
import Navigator from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./context/theme-context";

export default function App(): ReactElement {
  return (
    <TaxiDriverProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppBootstrap>
            <Navigator />
          </AppBootstrap>
        </ThemeProvider>
      </SafeAreaProvider>
    </TaxiDriverProvider>
  );
}
