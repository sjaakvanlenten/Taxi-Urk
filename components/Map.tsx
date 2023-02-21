import React from "react";
import MapView, { Marker } from "react-native-maps";
import { Taxi } from "../typings";

type MapProps = {
  data: Taxi[];
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
      {data.map((taxi, index) => (
        <Marker key={index} coordinate={taxi.location} />
      ))}
    </MapView>
  );
};

export default Map;
