import { LocationObjectCoords } from "expo-location";
import { push, ref, set, update } from "firebase/database";
import { FormData } from "../screens/Taxi/CreateNewTaxiScreen";
import { db } from "./firebaseConfig";

export const pushNewTaxiRef = async (data: FormData) => {
  const reference = await push(ref(db, "taxis"), {
    available: false,
    isSharingLocation: false,
    name: data.name,
    phone: data.phoneNumber,
    statusText: "",
  });

  set(ref(db, "locations/" + reference.key), {
    latitude: 0,
    longitude: 0,
  });

  return reference;
};

export const updateLocation = (
  taxiRef: string,
  locationCoords: LocationObjectCoords
) => {
  const updates = {};
  updates["/locations/" + taxiRef + "/latitude"] = locationCoords.latitude;
  updates["/locations/" + taxiRef + "/longitude"] = locationCoords.longitude;
  update(ref(db), updates);
};

export const setAvailability = (taxiRef: string, state: boolean) => {
  const updates = {};
  updates["/taxis/" + taxiRef + "/available"] = state;
  update(ref(db), updates);
};

export const setIsSharingLocation = (taxiRef: string, state: boolean) => {
  const updates = {};
  updates["/taxis/" + taxiRef + "/isSharingLocation"] = state;
  update(ref(db), updates);
};

export const setStatusTextDB = (taxiRef: string, text: string) => {
  const updates = {};
  updates["/taxis/" + taxiRef + "/statusText"] = text;
  update(ref(db), updates);
};
