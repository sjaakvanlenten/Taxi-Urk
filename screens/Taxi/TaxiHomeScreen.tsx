import { useCallback, useState } from "react";
import { StyleSheet, View, Keyboard, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";

import Header from "../../components/TaxiDriver/Header";
import Main from "../../components/TaxiDriver/Main";
import Controls from "../../components/TaxiDriver/Controls";
import ProfileSettings from "../../components/TaxiDriver/profile-settings";

import useTaxiDriverContext from "../../context/taxiDriver-context";

import useImagePicker from "../../hooks/useImagePicker";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";
import useLocation from "../../hooks/useLocation";
import useNotifications from "../../hooks/useNotifications";

import {
  setAvailability,
  setIsSharingLocation,
  setStatusTextDB,
} from "../../firebase/mutations";
import { uriToBlob } from "../../utils/uriToBlob";

const TaxiHomeScreen: React.FC = () => {
  const { taxi, setTaxi } = useTaxiDriverContext();
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

      const blob = await uriToBlob(imageUri);

      await uploadFile(blob, imageName);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const statusTextSubmitHandler = useCallback(
    (text: string) => {
      setStatusTextDB(taxi.id, text);
      setTaxi({
        ...taxi,
        statusText: text,
      });
    },
    [taxi]
  );

  const statusTextDeleteHandler = useCallback(() => {
    setStatusTextDB(taxi.id, "");
    setTaxi({
      ...taxi,
      statusText: "",
    });
    Toast.show("Bericht verwijderd", {
      duration: Toast.durations.SHORT,
    });
  }, [taxi]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible((prev) => !prev);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ProfileSettings
              uploadImageHandler={handleUpload}
              selectedImage={selectedImage}
            />
          </View>
        </View>
      </Modal>

      {/* Screen is pressable to dissmiss keyboard */}
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        {/* Content */}
        <View style={styles.content}>
          <Header pressableCallback={toggleModal} image={selectedImage} />
          <Main />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Controls
            statusText={taxi.statusText}
            isAvailable={isAvailable}
            isSyncingLocation={isSyncingLocation}
            toggleAvailability={toggleAvailability}
            toggleLocationSharing={toggleLocationSharing}
            statusTextDeleteHandler={statusTextDeleteHandler}
            statusTextSubmitHandler={statusTextSubmitHandler}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default TaxiHomeScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    rowGap: 20,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
