import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { onValue } from "firebase/database";
import { FlashList } from "@shopify/flash-list";

import BottomSheet from "../../components/BottomSheet";
import TaxiListItem from "../../components/TaxiListItem";
import Map from "../../components/Map";
import TopMenu from "../../components/TopMenu";
import MenuButton from "../../components/buttons/MenuButton";

import { sortByAvailability } from "../../firebase/queries";

import { LatLng } from "react-native-maps";
import { Taxi } from "../../typings";

export type locationData = {
  id: string;
  location: LatLng;
};

const TaxiHomeScreen: React.FC = () => {
  const [taxis, setTaxis] = useState<Taxi[]>([]);
  const [locations, setLocations] = useState<locationData[]>([]);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);

  useEffect(() => {
    const query = sortByAvailability();

    const listenForUpdates = onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        const arr = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          item.id = childSnapshot.key;

          arr.push(item);
        });
        setTaxis(arr.reverse());
      }
    });

    return () => listenForUpdates();
  }, []);

  const updateLocations = useCallback(
    (id: string, data: LatLng | null) => {
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
    },
    [locations]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TopMenu />
      <Map data={locations} enableInteraction={bottomSheetExpanded} />

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
              callback={updateLocations}
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
