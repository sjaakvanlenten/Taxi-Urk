import { StyleSheet, Platform, View, Text, TextInput } from "react-native";
import { FC, useEffect, useRef } from "react";
import * as Linking from "expo-linking";
import CustomButton from "../UI/CustomButton";
import CustomInput from "../UI/CustomInput";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

type FormData = {
  address: string;
};

const navigateWithGoogleMaps = (address: string) => {
  const dropOffLocation = address; // Replace with the actual drop-off location coordinates
  const formattedDropOffLocation = encodeURIComponent(dropOffLocation);
  const pickupLocation = "37.7749,-122.4194"; // Replace with the actual pickup location coordinates

  const googleMapsUrl = Platform.select({
    ios: `https://maps.apple.com/?saddr=${pickupLocation}&daddr=${dropOffLocation}`,
    android: `https://www.google.com/maps/dir/?api=1&destination=${dropOffLocation}`,
  });

  Linking.openURL(googleMapsUrl);
};

const Navigate: FC = () => {
  const {
    control,
    handleSubmit,
    formState,
    formState: { isSubmitSuccessful },
    reset,
  } = useForm<FormData>();

  const AddressInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
    AddressInputRef.current.blur();
  }, [reset, formState]);

  const submitHandler = (data: FormData) =>
    navigateWithGoogleMaps(data.address);

  return (
    <View style={styles.navigationContainer}>
      <Text style={styles.title}>Navigatie</Text>
      <View style={{ flexDirection: "row" }}>
        <CustomInput
          ref={AddressInputRef}
          name="address"
          placeholder="Adres..."
          control={control}
          style={styles.addressInput}
          textAlign="left"
        />
        <CustomButton
          buttonStyle={styles.navigateSubmitButton}
          onPressHandler={handleSubmit(submitHandler)}
          icon={<Ionicons name="navigate" size={22} color="whitesmoke" />}
        />
      </View>
    </View>
  );
};

export default Navigate;

const styles = StyleSheet.create({
  navigationContainer: {
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 10,
  },
  title: {
    fontFamily: "OpenSans-medium",
    fontSize: 18,
    marginBottom: 20,
  },
  addressInput: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    marginRight: 30,
    elevation: 5,
  },
  navigateSubmitButton: {
    borderRadius: 20,
    elevation: 5,
    paddingHorizontal: 5,
  },
});
