import { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  Keyboard,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  setAvailability,
  setIsSharingLocation,
  setStatusTextDB,
} from "../../firebase/mutations";
import useTaxiDriverContext from "../../context/taxiDriver-context";
import useImagePicker from "../../hooks/useImagePicker";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";
import useLocation from "../../hooks/useLocation";
import useNotifications from "../../hooks/useNotifications";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../context/theme-context";
import MessageBox from "../../components/MessageBox";
import Toast from "react-native-root-toast";

const TaxiHomeScreen: React.FC = () => {
  const { taxi, setTaxi } = useTaxiDriverContext();
  const { selectedImage, errorMessage, handleImagePicker } = useImagePicker();
  const { uploadFile } = useFirebaseStorage();
  const [isAvailable, setIsAvailable] = useState(taxi.available);
  const { onDisplayNotification, cancelNotification } = useNotifications();
  const [isSyncingLocation, setIsSyncingLocation] = useState(
    taxi.isSharingLocation
  );

  const { theme } = useTheme();

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

  const StatusTextSubmitHandler = useCallback(
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable
        style={{ flex: 1, padding: 10, justifyContent: "space-between" }}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={[styles.headerContainer, { marginHorizontal: -5 }]}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Feather name="menu" size={26} color="black" />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.headerTextMedium}>Dashboard</Text>
          </View>
          <View style={styles.rightElement}>
            <View style={styles.profileImageContainer}>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.profileImage}
                />
              )}
            </View>
          </View>
        </View>
        <View style={{ rowGap: 20 }}>
          <View style={styles.settingsBar}>
            <View style={styles.leftElement}>
              <Text style={styles.headerTextSmall}>Beschikbaarheid</Text>
            </View>
            <View style={styles.middleElement}>
              <Text style={styles.headerTextMedium}>
                {isAvailable ? "Online" : "Offline"}
              </Text>
            </View>
            <View style={styles.rightElement}>
              <Switch
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                trackColor={{ false: "#767577", true: theme.primary }}
                thumbColor="#fff"
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleAvailability}
                value={isAvailable}
              />
            </View>
          </View>
          <View style={styles.settingsBar}>
            <View style={styles.leftElement}>
              <Text style={styles.headerTextSmall}>Locatie Delen</Text>
            </View>
            <View style={styles.middleElement}>
              <Text style={styles.headerTextMedium}>
                {isSyncingLocation ? "Aan" : "Uit"}
              </Text>
            </View>
            <View style={styles.rightElement}>
              <Switch
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                trackColor={{
                  false: isAvailable ? "#767577" : "#e4e3e4",
                  true: theme.primary,
                }}
                thumbColor={isAvailable ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleLocationSharing}
                value={isSyncingLocation}
                disabled={!isAvailable}
              />
            </View>
          </View>
          <MessageBox
            placeholderText="Status Bericht..."
            data={taxi.statusText}
            submitHandler={StatusTextSubmitHandler}
            deleteHandler={statusTextDeleteHandler}
            submitButtonColor={theme.confirmButton}
            deleteButtonColor={theme.deleteButton}
            undoButtonColor={theme.background}
            currentData={taxi.statusText}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default TaxiHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: -5,
    height: 60,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 60,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    height: 100,
    textAlignVertical: "top",
    fontSize: 18,
    padding: 10,
  },
  headerTextSmall: {
    fontFamily: "OpenSans-regular",
    fontSize: 16,
  },
  headerTextMedium: {
    fontFamily: "OpenSans-semibold",
    fontSize: 18,
  },
  profileImageContainer: {
    width: 50,
    height: 50,

    backgroundColor: "red",
    borderRadius: 50 / 2,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    aspectRatio: 1,
  },
  leftElement: {
    flex: 3,
    alignItems: "flex-start",
  },
  middleElement: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightElement: {
    flex: 1,
    alignItems: "flex-end",
  },
});
