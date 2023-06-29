import { useState } from "react";
import { StyleSheet, Text, View, Switch, Image } from "react-native";
import * as SecureStore from "expo-secure-store";

import CustomButton from "../../components/CustomButton";
import {
  setAvailability,
  setIsSharingLocation,
} from "../../firebase/mutations";
import useTaxiDriverContext from "../../context/taxiDriver-context";
import useImagePicker, { STORAGE_KEY } from "../../hooks/useImagePicker";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";
import useLocation from "../../hooks/useLocation";
import useNotifications from "../../hooks/useNotifications";

const TaxiHomeScreen: React.FC = () => {
  const { taxi } = useTaxiDriverContext();
  const { selectedImage, errorMessage, handleImagePicker } = useImagePicker();
  const { uploadFile } = useFirebaseStorage();
  const [isAvailable, setIsAvailable] = useState(taxi.available);
  const { onDisplayNotification, cancelNotification } = useNotifications();
  const [isSyncingLocation, setIsSyncingLocation] = useState(
    taxi.isSharingLocation
  );

  const [errorMsg] = useLocation(isSyncingLocation);

  const toggleLocationSharing = () => {
    setIsSharingLocation(taxi.id, !isSyncingLocation);
    setIsSyncingLocation((previousState) => !previousState);
  };

  const toggleAvailability = () => {
    setAvailability(taxi.id, !isAvailable);
    setIsAvailable((previousState) => {
      previousState && setIsSyncingLocation(false);
      return !previousState;
    });
    isAvailable ? cancelNotification() : onDisplayNotification();
  };

  const handleUpload = async () => {
    try {
      const imageUri = await handleImagePicker();

      if (!imageUri) {
        return;
      }

      const imageName = `${taxi.id}.png`;

      const response = await fetch(imageUri);
      const blob = await response.blob();

      await uploadFile(blob, imageName);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.profileImage} />
        )}
      </View>
      <View
        style={{
          height: "30%",
          justifyContent: "space-evenly",

          alignItems: "center",
          width: "80%",
        }}
      >
        <View style={{ alignItems: "center", alignSelf: "stretch" }}>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              width: "60%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>Beschikbaarheid</Text>
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isAvailable ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleAvailability}
              value={isAvailable}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              width: "60%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: !isAvailable && "lightgrey" }}>
              Locatie Delen
            </Text>
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              trackColor={{ true: "#81b0ff" }}
              thumbColor={isSyncingLocation ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleLocationSharing}
              value={isSyncingLocation}
              disabled={!isAvailable}
            />
          </View>
        </View>
        <CustomButton
          onPressHandler={() => {
            SecureStore.deleteItemAsync("user");
            SecureStore.deleteItemAsync(STORAGE_KEY);
          }}
        >
          Verwijder Gebruiker
        </CustomButton>
        <CustomButton onPressHandler={handleUpload}>Kies foto</CustomButton>
      </View>
    </View>
  );
};

export default TaxiHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: "red",
    borderRadius: 60 / 2,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    aspectRatio: 1,
  },
});
