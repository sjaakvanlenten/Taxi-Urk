import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DataSnapshot } from "firebase/database";
import { FlashList } from "@shopify/flash-list";

import { light, dark } from "../../themes/theme";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import BottomSheet from "../../components/Client/BottomSheet";
import TaxiListItem from "../../components/Client/TaxiListItem";
import Map from "../../components/Client/Map";
import TopMenu from "../../components/Client/TopMenu";

import { sortByAvailability } from "../../firebase/queries";

import { LatLng } from "react-native-maps";
import { Taxi } from "../../types/typings";
import useFirebaseListener, {
  ListenerCallback,
} from "../../hooks/useFirebaseListener";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";
import useTheme from "../../context/theme-context";

export type locationData = {
  id: string;
  location: LatLng;
};

const ClientHomeScreen: React.FC = () => {
  const [locations, setLocations] = useState<locationData[]>([]);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const { downloadFile } = useFirebaseStorage();
  const { theme, toggleTheme } = useTheme();

  const TaxiListenerCallback: ListenerCallback<Array<Taxi>> = useCallback(
    async (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const promises = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          item.id = childSnapshot.key;
          const promise = downloadFile(childSnapshot.key).then((imageUri) => {
            item.image = imageUri;
            return item;
          });
          promises.push(promise);
        });

        const arr = await Promise.all(promises);
        return arr.reverse();
      }
    },
    []
  );

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

  const locationListenerCallback: ListenerCallback<void> = useCallback(
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
      <TopMenu backgroundColor={theme.background}>
        <Ionicons
          name="md-settings-sharp"
          size={28}
          color={theme.iconBackGround}
        />
        <FontAwesome5 name="taxi" size={28} color={theme.iconBackGround} />
        <MaterialCommunityIcons
          name="map-marker"
          size={28}
          color={theme.iconBackGround}
        />
        {theme.name === "light" ? (
          <Feather
            name="sun"
            size={28}
            color={light.iconBackGround}
            onPress={toggleTheme}
          />
        ) : (
          <Feather
            name="moon"
            size={28}
            color={dark.iconBackGround}
            onPress={toggleTheme}
          />
        )}
      </TopMenu>

      <Map
        data={locations}
        enableInteraction={bottomSheetExpanded}
        taxis={taxis}
      />

      <BottomSheet onStateChange={setBottomSheetExpanded}>
        {taxis ? (
          <FlashList
            data={taxis}
            renderItem={({ item: taxi }) => (
              <TaxiListItem
                name={taxi.name}
                id={taxi.id}
                phone={taxi.phone}
                available={taxi.available}
                image={taxi.image}
                isSharingLocation={taxi.isSharingLocation}
                listenerCallback={locationListenerCallback}
                updateLocation={updateLocations}
              />
            )}
            estimatedItemSize={80}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator
              size={48}
              color="#FFFFFF"
              style={{ marginBottom: 200 }}
            />
          </View>
        )}
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default ClientHomeScreen;
