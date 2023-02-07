import { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { onValue, push, ref, set } from "firebase/database";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "./firebase/firebaseConfig";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { UserLocationChangeEvent } from "react-native-maps/lib/MapView.types";
import { LatLng } from "react-native-maps/lib/sharedTypes";
import {
  LocationObject,
  LocationObjectCoords,
  LocationSubscription,
} from "expo-location";

export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const subscription = useRef<LocationSubscription>(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    if (subscription.current) {
      subscription.current.remove();
    }

    subscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000,
      },
      (location: LocationObject) => {
        writeToDatabase("0", location.coords);
      }
    );
  };

  //   useEffect(() => {
  //     getLocation();
  //     return () => {
  //       if (subscription.current) {
  //         subscription.current.remove();
  //       }
  //     };
  //   }, []);

  useEffect(() => {
    const query = ref(db, "taxis");
    return onValue(query, (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        console.log(data);
        setMarkers(data);
      }
    });
  }, []);

  const writeToDatabase = (taxiId: string, location: LocationObjectCoords) => {
    set(ref(db, "taxis/" + taxiId + "/location"), {
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const addToDatabase = () => {
    const taxiListRef = ref(db, "taxis");
    const newTaxiRef = push(taxiListRef);

    set(newTaxiRef, {
      available: false,
      location: {
        latitude: 52.6616201,
        longitude: 5.5996291,
      },
      name: "Kees",
      phone: 612345678,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={{ width: "100%", height: 300, marginBottom: 50 }}
        initialRegion={{
          latitude: 52.661909,
          longitude: 5.614741,
          latitudeDelta: 0.001,
          longitudeDelta: 0.045,
        }}
        // showsUserLocation={true}
        // onUserLocationChange={(event: UserLocationChangeEvent) => {
        //   writeToDatabase("2", event.nativeEvent.coordinate);
        // }}
      >
        {/* {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))} */}
      </MapView>
      <Pressable
        style={{
          height: 50,
          width: 100,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "royalblue",
          borderRadius: 20,
          overflow: "hidden",
        }}
        android_ripple={{
          color: "gray",
          borderless: false,
          foreground: false,
        }}
        onPress={() => subscription.current.remove()}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Remove Listener
        </Text>
      </Pressable>

      <Pressable
        style={{
          height: 50,
          width: 100,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "royalblue",
          borderRadius: 20,
          overflow: "hidden",
        }}
        android_ripple={{
          color: "gray",
          borderless: false,
          foreground: false,
        }}
        onPress={() => addToDatabase()}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Add Listener
        </Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
