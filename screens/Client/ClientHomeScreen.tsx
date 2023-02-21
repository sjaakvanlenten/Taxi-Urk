import React, { useEffect, useState } from "react";

import { ref, onChildChanged, get } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import { FlashList } from "@shopify/flash-list";
import { Taxi } from "../../typings";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import BottomSheet from "../../components/BottomSheet";
import TaxiListItem from "../../components/taxiListItem";
import Map from "../../components/Map";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map data={taxis} />
      <BottomSheet startY={350}>
        <FlashList
          data={taxis}
          renderItem={({ item: taxi }) => <TaxiListItem taxi={taxi} />}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default TaxiHomeScreen;
