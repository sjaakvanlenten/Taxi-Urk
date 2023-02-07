import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { useForm, FieldValues } from "react-hook-form";

import { queryByPhoneNumber } from "../../firebase/queries";
import { RootStackScreenProps } from "../../navigation/types";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

import { storeTaxiUserLocally } from "../../async-storage/mutations";
import { pushNewTaxiRef } from "../../firebase/mutations";
import { resetNavigationState } from "../../navigation/actions";

export interface FormData extends FieldValues {
  name: string;
  phoneNumber: string;
}

const CreateNewTaxiScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [errorMessage, setErrorMessage] = useState(null);

  const navigation =
    useNavigation<RootStackScreenProps<"TaxiHome">["navigation"]>();

  const addTaxiUserToDatabase = (data: FormData) => {
    const query = queryByPhoneNumber(data.phoneNumber);

    get(query).then((snapshot) => {
      if (!snapshot.exists()) {
        try {
          pushNewTaxiRef(data).then((newTaxiRef) => {
            storeTaxiUserLocally(newTaxiRef.key).then(() => {
              resetNavigationState(navigation, { taxiRef: newTaxiRef.key });
            });
          });
        } catch (e) {
          setErrorMessage(e);
        }
      } else {
        setErrorMessage("Dit telefoonnummer is al geregistreerd.");
      }
    });
  };

  const onSubmit = (data: FormData) => addTaxiUserToDatabase(data);

  return (
    <View style={styles.container}>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <CustomInput
        name="name"
        placeholder="Naam"
        rules={{ required: "Vul je naam in" }}
        control={control}
      />
      <CustomInput
        name="phoneNumber"
        placeholder="Telefoonnummer"
        rules={{
          required: "Geef een geldig telefoonnumer op",
          minLength: {
            value: 10,
            message: "Geef een 10-cijferig telefoonnummer op",
          },
        }}
        control={control}
      />

      <CustomButton onPressHandler={handleSubmit(onSubmit)}>
        Aanmaken
      </CustomButton>
    </View>
  );
};

export default CreateNewTaxiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    fontFamily: "sans-serif",
    fontSize: 14,
  },
});
