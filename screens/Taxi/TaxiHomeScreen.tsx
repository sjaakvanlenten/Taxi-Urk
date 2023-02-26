import { useState, useCallback } from "react";
import { StyleSheet, Text, View, Switch } from "react-native";

import { LocationObject } from "expo-location";
import { useRoute } from "@react-navigation/native";

import useLocation from "../../hooks/useLocation";
import CustomButton from "../../components/CustomButton";
import { RootStackScreenProps } from "../../navigation/types";
import { deleteTaxiUser } from "../../async-storage/mutations";
import {
  setAvailability,
  setIsSharingLocation,
  updateLocation,
} from "../../firebase/mutations";

const TaxiHomeScreen: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSyncingLocation, setIsSyncingLocation] = useState(false);
  const {
    params: { taxiRef },
  } = useRoute<RootStackScreenProps<"TaxiHome">["route"]>();

  const syncLocationWithDatabase = useCallback((location: LocationObject) => {
    updateLocation(taxiRef, location.coords);
  }, []);

  const [errorMsg] = useLocation(isSyncingLocation, syncLocationWithDatabase);

  const toggleLocationSharing = () => {
    setIsSharingLocation(taxiRef, !isSyncingLocation);
    setIsSyncingLocation((previousState) => !previousState);
  };

  const toggleAvailability = () => {
    setAvailability(taxiRef, !isAvailable);
    setIsAvailable((previousState) => {
      previousState && setIsSyncingLocation(false);
      return !previousState;
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          height: "30%",
          justifyContent: "space-evenly",

          alignItems: "center",
          width: "80%",
        }}
      >
        <View style={{ alignItems: "center", alignSelf: "stretch" }}>
          <View
            style={{
              flexDirection: "row",

              width: "60%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>Beschikbaarheid</Text>
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isAvailable ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleAvailability}
              value={isAvailable}
            />
          </View>
          <View
            style={{
              flexDirection: "row",

              width: "60%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: !isAvailable && "lightgrey" }}>
              Locatie Delen
            </Text>
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              trackColor={{ true: "#81b0ff" }}
              thumbColor={isSyncingLocation ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleLocationSharing}
              value={isSyncingLocation}
              disabled={!isAvailable}
            />
          </View>
        </View>
        <CustomButton onPressHandler={deleteTaxiUser}>
          Verwijder Gebruiker
        </CustomButton>
      </View>
    </View>
  );
};

export default TaxiHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
