import { ReactElement } from "react";
import AppBootstrap from "./components/app-bootstrap";
import { TaxiDriverProvider } from "./context/taxiDriver-context";
import Navigator from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App(): ReactElement {
  return (
    <TaxiDriverProvider>
      <SafeAreaProvider>
        <AppBootstrap>
          <Navigator />
        </AppBootstrap>
      </SafeAreaProvider>
    </TaxiDriverProvider>
  );
}
