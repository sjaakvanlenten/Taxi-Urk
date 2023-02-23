import { equalTo, orderByChild, query, ref } from "firebase/database";
import { db } from "./firebaseConfig";

const taxisRef = ref(db, "taxis");

export const queryByPhoneNumber = (phoneNumber: string) =>
  query(taxisRef, orderByChild("phone"), equalTo(phoneNumber));

export const sortByAvailability = () =>
  query(taxisRef, orderByChild("available"));
