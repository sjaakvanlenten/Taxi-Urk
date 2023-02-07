import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeTaxiUserLocally = async (userId: string) => {
  try {
    await AsyncStorage.setItem("@user", userId);
  } catch (e) {
    return e;
  }
};

export const deleteTaxiUser = async () => {
  try {
    await AsyncStorage.removeItem("@user");
  } catch (e) {
    return e;
  }
};
