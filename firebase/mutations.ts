import { LocationObjectCoords } from "expo-location";
import { push, ref, update } from "firebase/database";
import { FormData } from "../screens/Taxi/CreateNewTaxiScreen";
import { db } from "./firebaseConfig";

export const pushNewTaxiRef = (data: FormData) => {
  return push(ref(db, "taxis"), {
    available: false,
    location: {
      latitude: 0,
      longitude: 0,
    },
    name: data.name,
    phone: data.phoneNumber,
  });
};

export const updateLocation = (
  taxiRef: string,
  locationCoords: LocationObjectCoords
) => {
  const updates = {};
  updates["/taxis/" + taxiRef + "/location/latitude"] = locationCoords.latitude;
  updates["/taxis/" + taxiRef + "/location/longitude"] =
    locationCoords.longitude;
  update(ref(db), updates);
};

export const setAvailability = (taxiRef: string, state: boolean) => {
  const updates = {};
  updates["/taxis/" + taxiRef + "/available"] = state;
  update(ref(db), updates);
};
