import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TaxiHomeScreen from "../screens/Taxi/TaxiHomeScreen";
import ClientHomeScreen from "../screens/Client/ClientHomeScreen";
import WelcomeScreen from "../screens";
import CreateNewTaxiScreen from "../screens/Taxi/CreateNewTaxiScreen";
import useTaxiDriverContext from "../context/taxiDriver-context";
import { RootStackParamList } from "./types";
import { light } from "../themes/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  const { taxi } = useTaxiDriverContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={taxi?.id ? "TaxiHome" : "Welcome"}
        screenOptions={{
          contentStyle: { backgroundColor: light.primary },
        }}
      >
        <Stack.Group>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateNewTaxi"
            component={CreateNewTaxiScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="TaxiHome"
            component={TaxiHomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="ClientHome"
            component={ClientHomeScreen}
            options={{ headerShown: false, animation: "slide_from_left" }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
