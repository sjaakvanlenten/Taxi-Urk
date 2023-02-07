import { View, Text, StyleSheet, Switch, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { setAvailability } from "../../firebase/mutations";
import { get, onChildChanged, ref } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import { Taxi } from "../../typings";
import { FlashList } from "@shopify/flash-list";

const TestingScreen = () => {
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
          renderItem={({ item: taxi }) => {
            return (
              <View
                style={{
                  height: 40,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text>{taxi.name}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Switch
                    style={{
                      transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                      marginRight: 20,
                    }}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={taxi.available ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() =>
                      setAvailability(taxi.id, !taxi.available)
                    }
                    value={taxi.available}
                  />
                </View>
              </View>
            );
          }}
          estimatedItemSize={40}
        />
      </View>
    </View>
  );
};

export default TestingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
