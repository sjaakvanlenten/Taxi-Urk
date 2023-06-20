import React, { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DataSnapshot } from "firebase/database";
import { FlashList } from "@shopify/flash-list";

import BottomSheet from "../../components/BottomSheet";
import TaxiListItem from "../../components/TaxiListItem";
import Map from "../../components/Map";
import TopMenu from "../../components/TopMenu";

import { sortByAvailability } from "../../firebase/queries";

import { LatLng } from "react-native-maps";
import { Taxi } from "../../typings";
import useFirebaseListener from "../../hooks/useFirebaseListener";

export type locationData = {
  id: string;
  location: LatLng;
};

const TaxiHomeScreen: React.FC = () => {
  const [locations, setLocations] = useState<locationData[]>([]);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);

  const TaxiListenerCallback = useCallback((snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const arr = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;

        arr.push(item);
      });
      return arr.reverse();
    }
  }, []);

  const { data: taxis }: { data: Taxi[] } = useFirebaseListener({
    callback: TaxiListenerCallback,
    query: sortByAvailability,
    isActiveByDefault: true,
  });

  const updateLocations = (id: string, data: LatLng | null) => {
    setLocations((locations) => {
      const arr = [...locations];
      const match = locations.findIndex((element) => element.id === id);
      if (match < 0) {
        arr.push({
          id,
          location: data,
        });
      } else {
        !data ? arr.splice(match, 1) : (arr[match].location = data);
      }
      return arr;
    });
  };

  const locationListenerCallback = useCallback(
    (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const id = snapshot.key;
        const data = snapshot.val();

        updateLocations(id, data);
      }
    },
    [locations]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TopMenu />
      <Map
        data={locations}
        enableInteraction={bottomSheetExpanded}
        taxis={taxis}
      />

      <BottomSheet stateHandler={setBottomSheetExpanded}>
        <FlashList
          data={taxis}
          renderItem={({ item: taxi }) => (
            <TaxiListItem
              name={taxi.name}
              id={taxi.id}
              phone={taxi.phone}
              available={taxi.available}
              isSharingLocation={taxi.isSharingLocation}
              listenerCallback={locationListenerCallback}
              updateLocation={updateLocations}
            />
          )}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default TaxiHomeScreen;
