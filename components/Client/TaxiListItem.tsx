import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useEffect, FC } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";

import { DataSnapshot, ref } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import { LatLng } from "react-native-maps";
import useTheme from "../../context/theme-context";
import useFirebaseListener from "../../hooks/useFirebaseListener";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type TaxiListItemProps = {
  name: string;
  id: string;
  phone: string;
  available: boolean;
  image: string;
  isSharingLocation: boolean;
  listenerCallback: (data: DataSnapshot) => void;
  updateLocation: (id: string, data: LatLng | null) => void;
};

const rippleConfig = {
  borderless: true,
  radius: 22,
};

const TaxiListItem: FC<TaxiListItemProps> = ({
  name,
  id,
  phone,
  available,
  image,
  isSharingLocation,
  listenerCallback,
  updateLocation,
}) => {
  const { theme } = useTheme();

  const [trackLocation, setTrackLocation] = useState(false);

  const locationRef = ref(db, "locations/" + id);

  const { setIsListenerActive } = useFirebaseListener({
    callback: listenerCallback,
    query: locationRef,
  });

  const onPressMarker = () => {
    Haptics.selectionAsync();
    if (trackLocation) {
      setIsListenerActive(false);
      updateLocation(id, null);
    } else {
      setIsListenerActive(true);
    }
    setTrackLocation((trackLocation) => !trackLocation);
  };

  useEffect(() => {
    if (!isSharingLocation && trackLocation) {
      setIsListenerActive(false);
      updateLocation(id, null);
      setTrackLocation(false);
    }
  }, [isSharingLocation]);

  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(1, {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    });
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
      transform: [
        {
          scale: animatedValue.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          backgroundColor: theme.listItemBackground,
        },
        rStyle,
      ]}
    >
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: image ? image : "https://i.pravatar.cc/300",
          }}
          style={styles.profileImage}
        />
        <View>
          <Text
            style={[
              styles.headerNameText,
              {
                color: theme.textColor,
              },
            ]}
          >
            {name}
          </Text>
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
          onPress={isSharingLocation ? onPressMarker : null}
          android_ripple={
            isSharingLocation
              ? {
                  color: "#c83c26",
                  ...rippleConfig,
                }
              : {}
          }
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
    </Animated.View>
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
    marginBottom: 18,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerNameText: {
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
    backgroundColor: "rgba(200, 60, 38, 0.4)",
  },
});
