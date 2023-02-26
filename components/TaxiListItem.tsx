import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";

import { off, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { LatLng } from "react-native-maps";

type TaxiListItemProps = {
  name: string;
  id: string;
  phone: string;
  available: boolean;
  isSharingLocation: boolean;
  callback: (id: string, location: LatLng | null) => void;
};

const rippleConfig = {
  borderless: true,
  radius: 22,
};

const TaxiListItem: React.FC<TaxiListItemProps> = ({
  name,
  id,
  phone,
  available,
  isSharingLocation,
  callback,
}) => {
  const [trackLocation, setTrackLocation] = useState(false);

  const locationRef = ref(db, "locations/" + id);

  const onPressMarker = () => {
    Haptics.selectionAsync();
    if (trackLocation) {
      off(locationRef);
      callback(id, null);
    }
    setTrackLocation((trackLocation) => !trackLocation);
  };

  useEffect(() => {
    const locationListener = () => {
      onValue(locationRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.key, snapshot.val());
        }
      });
    };

    if (trackLocation) {
      if (!isSharingLocation) {
        off(locationRef);
        callback(id, null);
        setTrackLocation(false);
      } else {
        locationListener();
      }
    }
  }, [trackLocation, isSharingLocation]);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.headerNameText}>{name}</Text>
          <Text
            style={[
              {
                color: available ? "#3EB489" : "#Ff2400",
              },
              styles.headerStatusText,
            ]}
          >
            {available ? "Beschikbaar" : "Afwezig"}
          </Text>
        </View>
      </View>
      <View style={styles.iconsOuterContainer}>
        <Pressable
          style={[
            styles.iconInnerContainer,
            isSharingLocation && trackLocation && styles.markerActive,
          ]}
          onPress={isSharingLocation ? onPressMarker : () => {}}
          android_ripple={{
            color: "#c83c26",
            ...rippleConfig,
          }}
        >
          <MaterialCommunityIcons
            name="map-marker"
            size={28}
            color={isSharingLocation ? "#c83c26" : "grey"}
          />
        </Pressable>
        <Pressable
          style={[{ marginLeft: 15 }, styles.iconInnerContainer]}
          android_ripple={{ color: "#de932c", ...rippleConfig }}
        >
          <MaterialCommunityIcons name="car-info" size={30} color="#f7a331" />
        </Pressable>
        <Pressable
          style={[{ marginLeft: 15 }, styles.iconInnerContainer]}
          android_ripple={{ color: "#38a27b", ...rippleConfig }}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <FontAwesome5 name="phone" size={22} color="#3EB489" />
        </Pressable>
      </View>
    </View>
  );
};

export default TaxiListItem;

const styles = StyleSheet.create({
  itemContainer: {
    height: 80,
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: 18,
    borderRadius: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerNameText: {
    color: "#232428",
    fontFamily: "OpenSans-semibold",
    fontSize: 16,
  },
  headerStatusText: {
    fontFamily: "OpenSans-regular",
    fontSize: 12,
  },
  iconsOuterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconInnerContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 15,
  },
  markerActive: {
    backgroundColor: "rgba(200, 60, 38, 0.3)",
  },
});
