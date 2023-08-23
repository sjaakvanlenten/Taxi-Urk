import { FC, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import CustomButton from "../CustomButton";
import EditableText from "../EditableText";

import useTheme from "../../context/theme-context";
import useTaxiDriverContext from "../../context/taxiDriver-context";

import {
  setCarModel,
  setTotalPassengerSeats,
  updateName,
  updatePhone,
} from "../../firebase/mutations";

interface ProfileSettingsProps {
  uploadImageHandler: () => void;
  selectedImage: string;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({
  uploadImageHandler,
  selectedImage,
}) => {
  const { theme } = useTheme();
  const { taxi, setTaxi } = useTaxiDriverContext();

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View
      style={{
        rowGap: 50,
        width: "100%",
      }}
    >
      {/* Profile Picture */}
      <View
        style={{
          alignItems: "center",
        }}
      >
        <View>
          <View
            style={[
              styles.profileImageContainer,
              {
                backgroundColor: theme.confirmButton,
                borderColor: theme.primary,
              },
            ]}
          >
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.profileImage}
              />
            )}
          </View>
          <CustomButton
            onPressHandler={uploadImageHandler}
            width={50}
            height={50}
            color={theme.primary}
            icon={
              <MaterialCommunityIcons
                name="image-edit"
                size={26}
                color={theme.iconBackGround}
              />
            }
            buttonStyle={{
              position: "absolute",
              borderRadius: 50 / 2,
              bottom: 0,
              right: 0,
            }}
          />
        </View>
      </View>

      <View style={{ rowGap: 15 }}>
        <View style={styles.profileDataContainer}>
          <MaterialIcons name="person" size={30} color={theme.primary} />
          <EditableText
            validationRules={{
              required: "Geef een naam op",
            }}
            initialValue={taxi?.name}
            placeHolder="Naam"
            submitCallback={(data) => {
              updateName(taxi.id, data);
              setTaxi({
                ...taxi,
                name: data,
              });
            }}
            iconColor="#5d5d5d"
          />
        </View>

        <View style={styles.profileDataContainer}>
          <MaterialIcons name="local-phone" size={30} color={theme.primary} />
          <EditableText
            initialValue={taxi?.phone}
            placeHolder="Telefoonnummer"
            iconColor="#5d5d5d"
            submitCallback={(data) => {
              setTaxi({
                ...taxi,
                phone: data,
              });
              updatePhone(taxi.id, data);
            }}
            validationRules={{
              required: "Geef een geldig telefoonnummer op",

              pattern: {
                value: /^((\+316|06|00316){1}\s?-?\s?[1-9]{1}[0-9]{7})$/,
                message: "Geef een geldig 06-nummer op",
              },
            }}
          />
        </View>

        <View style={styles.profileDataContainer}>
          <MaterialIcons name="local-taxi" size={30} color={theme.primary} />
          <EditableText
            initialValue={taxi?.carModel}
            iconColor="#5d5d5d"
            placeHolder="Model Auto"
            submitCallback={(data) => {
              setCarModel(taxi.id, data);
              setTaxi({
                ...taxi,
                carModel: data,
              });
            }}
          />
        </View>

        <View style={styles.profileDataContainer}>
          <MaterialCommunityIcons
            name="seat-passenger"
            size={30}
            color={theme.primary}
          />
          <EditableText
            initialValue={taxi.totalPassengerSeats}
            iconColor="#5d5d5d"
            placeHolder="Aantal Zitplaatsen"
            submitCallback={(data) => {
              setTotalPassengerSeats(taxi.id, data);
              setTaxi({
                ...taxi,
                totalPassengerSeats: data,
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  profileImageContainer: {
    width: 200,
    height: 200,
    borderWidth: 2,
    backgroundColor: "red",
    borderRadius: 200 / 2,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    aspectRatio: 1,
  },
  profileDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
});
