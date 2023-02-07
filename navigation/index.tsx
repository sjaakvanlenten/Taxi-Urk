import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TaxiHomeScreen from "../screens/Taxi/TaxiHomeScreen";
import ClientHomeScreen from "../screens/Client/ClientHomeScreen";
import WelcomeScreen from "../screens";
import CreateNewTaxiScreen from "../screens/Taxi/CreateNewTaxiScreen";
import useTaxiDriverContext from "../context/taxiDriver-context";
import { RootStackParamList } from "./types";
import TestingScreen from "../screens/Test/TestingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  const { taxiId } = useTaxiDriverContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={taxiId ? "TaxiHome" : "Welcome"}
        screenOptions={{ headerStyle: { backgroundColor: "whitesmoke" } }}
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
            options={{ headerShown: false }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="TaxiHome"
            component={TaxiHomeScreen}
            options={{ headerShown: false }}
            initialParams={taxiId && { taxiRef: taxiId }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="ClientHome"
            component={ClientHomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="TestingScreen"
            component={TestingScreen}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
