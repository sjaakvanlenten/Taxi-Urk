import { LocationObjectCoords } from "expo-location";
import { get, push, ref, set, update } from "firebase/database";
import { FormData } from "../screens/Taxi/CreateNewTaxiScreen";
import { db } from "./firebaseConfig";
import { queryByPhoneNumber } from "./queries";

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

export const updateName = async (taxiRef: string, text: string) => {
  try {
    const updates = {};
    updates["/taxis/" + taxiRef + "/name"] = text;
    await update(ref(db), updates);
    // The update operation was successful, you can handle any additional actions here if needed.
  } catch (error) {
    console.error("Error updating name:", error);
    // Handle the error if the update operation fails.
  }
};

export const updatePhone = (taxiRef: string, text: string) => {
  const query = queryByPhoneNumber(text);

  get(query).then(async (snapshot) => {
    if (!snapshot.exists()) {
      try {
        const updates = {};
        updates["/taxis/" + taxiRef + "/phone"] = text;
        await update(ref(db), updates);
        // The update operation was successful, you can handle any additional actions here if needed.
      } catch (error) {
        console.error("Error updating Phone:", error);
        // Handle the error if the update operation fails.
      }
    } else {
      return "Dit telefoonnumer is al geregistreerd";
    }
  });
};

export const setCarModel = (taxiRef: string, text: string) => {
  set(ref(db, "taxis/" + taxiRef + "/carModel"), text);
};

export const setTotalPassengerSeats = (taxiRef: string, text: string) => {
  set(ref(db, "taxis/" + taxiRef + "/totalPassengerSeats"), text);
};
