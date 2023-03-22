import React from "react";
import MapView, { Marker } from "react-native-maps";
import useTheme from "../context/theme-context";
import { locationData } from "../screens/Client/ClientHomeScreen";

type MapProps = {
  data: locationData[];
  enableInteraction: boolean;
};

const Map = ({ data, enableInteraction }: MapProps) => {
  const { theme } = useTheme();
  return (
    <MapView
      style={{ flex: 1, padding: 20 }}
      customMapStyle={theme.mapStyle}
      scrollEnabled={!enableInteraction}
      zoomEnabled={!enableInteraction}
      rotateEnabled={false}
      initialRegion={{
        latitude: 52.661909,
        longitude: 5.614741,
        latitudeDelta: 0.001,
        longitudeDelta: 0.045,
      }}
    >
      {data.length !== 0 &&
        data.map((locationData) => (
          <Marker key={locationData.id} coordinate={locationData.location} />
        ))}
    </MapView>
  );
};

export default Map;
