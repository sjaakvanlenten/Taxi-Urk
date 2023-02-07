import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { ref, onChildChanged, get } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import { FlashList } from "@shopify/flash-list";
import { Taxi } from "../../typings";

const TaxiHomeScreen: React.FC = () => {
  const [taxis, setTaxis] = useState<Taxi[]>([]);

  useEffect(() => {
    get(ref(db, "taxis")).then((snapshot) => {
      if (snapshot.exists()) {
        const arr = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          item.id = childSnapshot.key;

          arr.push(item);
        });
        setTaxis(arr);
      }
    });
  }, []);

  useEffect(() => {
    const taxisRef = ref(db, "taxis");

    const unSub = onChildChanged(taxisRef, (snapshot) => {
      if (snapshot.exists) {
        const taxiId = snapshot.key;

        const newData = snapshot.val();
        setTaxis((taxis) => {
          const arr = [...taxis];

          const index = arr.findIndex((taxi) => taxi.id === taxiId);
          arr[index] = { id: taxiId, ...newData };

          return arr;
        });
      }
    });
    return () => unSub();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 200,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 10,
        }}
      >
        <FlashList
          data={taxis}
          renderItem={({ item }) => item.available && <Text>{item.name}</Text>}
          estimatedItemSize={20}
        />
      </View>
    </View>
  );
};

export default TaxiHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: 300,
  },
});
