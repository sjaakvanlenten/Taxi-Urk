import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import useTheme from "../../context/theme-context";
import { locationData } from "../../screens/Client/ClientHomeScreen";
import { View, StyleSheet, Image, Text } from "react-native";
import { Taxi } from "../../types/typings";

type MapProps = {
  data?: locationData[];
  enableInteraction?: boolean;
  taxis?: Taxi[];
};

const Map = ({ data, enableInteraction, taxis }: MapProps) => {
  const { theme } = useTheme();
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1, padding: 20 }}
      customMapStyle={theme.mapStyle}
      scrollEnabled={!enableInteraction}
      zoomEnabled={!enableInteraction}
      moveOnMarkerPress={false}
      rotateEnabled={false}
      initialRegion={{
        latitude: 52.661909,
        longitude: 5.614741,
        latitudeDelta: 0.001,
        longitudeDelta: 0.045,
      }}
    >
      {data?.length !== 0 &&
        data?.map((location) => {
          const { name, image: imageUri } = taxis.find(
            ({ id: taxiId }) => taxiId === location.id
          );
          return (
            <Marker
              key={location.id}
              coordinate={location.location}
              pinColor="#f9b55a"
              calloutAnchor={{ x: 0.5, y: -0.2 }}
            >
              <View style={styles.marker}>
                <Image
                  source={{
                    uri: imageUri ? imageUri : "https://i.pravatar.cc/300",
                  }}
                  resizeMode="contain"
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.marker2} />
              <Callout tooltip={true}>
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{name}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  marker: {
    position: "absolute",

    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    borderWidth: 2,
    borderColor: "#f9b55a",
  },
  marker2: {
    position: "absolute",
    width: 0,
    height: 0,
    bottom: -48,
    left: 5,
    zIndex: -1,
    borderWidth: 10,
    borderColor: "transparent",
    borderTopWidth: 11,
    borderTopColor: "#f9b55a",
  },
  profileImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 50,
  },
  tooltip: {
    width: 50,
    height: 30,
    borderRadius: 10,
    padding: 4,
    backgroundColor: "#fcfcfc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f9b55a",
  },
  tooltipText: {
    fontFamily: "OpenSans-regular",
    fontSize: 12,
  },
});
