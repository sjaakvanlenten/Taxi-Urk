import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  child,
  onValue,
  ref,
  onChildChanged,
  get,
  off,
} from "firebase/database";
import { db } from "../../firebaseConfig";

const TaxiHomeScreen = () => {
  const [taxis, setTaxis] = useState([]);

  useEffect(() => {
    const query = ref(db, "taxis");
    get(query).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = [];
        Object.keys(data).map((key) => {
          arr[key] = data[key];
        });
        setTaxis(arr);
      }
    });
  }, []);

  useEffect(() => {
    const taxisRef = ref(db, "taxis");

    onChildChanged(taxisRef, (snapshot) => {
      if (snapshot.exists) {
        const taxiId = snapshot.key;
        const location = snapshot.child("location").val();
        setTaxis((taxis) => {
          let arr = taxis;
          console.log(taxiId, location);
          arr[taxiId]["location"] = location;
          console.log(arr);
          return arr;
        });
      }
    });
    return () => off(taxisRef);
  }, []);
  console.log(taxis["-NLbbSH7U_NWmx_Uan4E"]);
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
      >
        {/* {markers.map((location, index) => (
          <Marker key={index} coordinate={location} />
        ))} */}
        {/* <Marker coordinate={{ latitude: 52.6616177, longitude: 5.5996622 }} />
        <Marker coordinate={{ latitude: 52.66, longitude: 5.62 }} />
        <Marker coordinate={{ latitude: 52.665949, longitude: 5.614656 }} />
        <Marker coordinate={{ latitude: 52.66, longitude: 5.6132 }} /> */}
      </MapView>
    </View>
  );
};

export default TaxiHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
