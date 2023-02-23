import React from "react";
import MapView, { Marker } from "react-native-maps";
import { locationData } from "../screens/Client/ClientHomeScreen";

type MapProps = {
  data: locationData[];
};

const Map = ({ data }: MapProps) => {
  return (
    <MapView
      style={{ flex: 0.5, padding: 20 }}
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
