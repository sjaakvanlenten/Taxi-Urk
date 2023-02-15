import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import MapView, { Marker } from "react-native-maps";
import { ref, onChildChanged, get } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import { FlashList } from "@shopify/flash-list";
import { Taxi } from "../../typings";
import { FontAwesome5 } from "@expo/vector-icons";

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

  const ListItem = ({ taxi }: { taxi: Taxi }) => {
    return (
      <View
        style={{
          height: 50,
          width: "100%",
          borderRadius: 30,
          backgroundColor: "#F5B212",
          marginBottom: 20,
          alignItems: "center",
          paddingHorizontal: 30,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {taxi.name}
        </Text>
        <Pressable
          style={{
            width: 40,
            height: 40,
            borderRadius: 100,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => Linking.openURL(`tel:${taxi.phone}`)}
        >
          <FontAwesome5 name="phone" size={26} color="green" />
        </Pressable>
      </View>
    );
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
      >
        {taxis.map((taxi, index) => (
          <Marker key={index} coordinate={taxi.location} />
        ))}
      </MapView>
      <View
        style={{
          height: 280,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <FlashList
          data={taxis}
          renderItem={({ item: taxi }) => <ListItem taxi={taxi} />}
          estimatedItemSize={30}
        />
      </View>
    </View>
  );
};

export default TaxiHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: 300,
  },
});
