import { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";

import { get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { useForm, FieldValues, useFormState } from "react-hook-form";
import { Feather } from "@expo/vector-icons";

import { queryByPhoneNumber } from "../../firebase/queries";
import { RootStackScreenProps } from "../../navigation/types";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

import { storeTaxiUserLocally } from "../../async-storage/mutations";
import { pushNewTaxiRef } from "../../firebase/mutations";
import { resetNavigationState } from "../../navigation/actions";
import { light } from "../../themes/theme";

export interface FormData extends FieldValues {
  name: string;
  phoneNumber: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CreateNewTaxiScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, defaultValues },
  } = useForm<FormData>();

  const { isValid } = useFormState({
    control,
  });

  const watchNameValue = watch("name");

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
          setError("phoneNumber", { type: "custom", message: e });
        }
      } else {
        setError("phoneNumber", {
          type: "custom",
          message: "Dit telefoonnummer is al geregistreerd.",
        });
      }
    });
  };

  const scrollRef = useRef<ScrollView>();

  const onButtonPressHandler = useCallback(() => {
    scrollRef.current?.scrollTo({ x: SCREEN_WIDTH });
  }, []);

  const onGoBackButtonPressHandler = useCallback(() => {
    scrollRef.current?.scrollTo({ x: 0 });
  }, []);

  const onSubmit = (data: FormData) => addTaxiUserToDatabase(data);

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      horizontal
      pagingEnabled
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.pageContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Wat is je naam?</Text>

          <CustomInput name="name" placeholder="Naam" control={control} />
        </View>
        <CustomButton
          onPressHandler={onButtonPressHandler}
          active={watchNameValue ? watchNameValue.length > 1 : false}
        >
          Doorgaan
        </CustomButton>
      </View>

      <View>
        <Pressable
          style={styles.pressableBackButton}
          onPress={onGoBackButtonPressHandler}
        >
          <Feather name="arrow-left" size={26} color={light.black} />
        </Pressable>

        <View style={styles.pageContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Je telefoonnummer?</Text>

            <CustomInput
              name="phoneNumber"
              placeholder="06..."
              rules={{
                required: "Geef een geldig telefoonnumer op",

                pattern: {
                  value: /^((\+316|06|00316){1}\s?-?\s?[1-9]{1}[0-9]{7})$/,
                  message: "Geef een geldig 06-nummer op",
                },
              }}
              control={control}
            />
          </View>
          <CustomButton
            onPressHandler={handleSubmit(onSubmit)}
            active={isValid}
          >
            Aanmaken
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateNewTaxiScreen;

const styles = StyleSheet.create({
  pageContainer: {
    width: SCREEN_WIDTH,
    justifyContent: "space-between",
    paddingBottom: 30,
    paddingHorizontal: 30,
    marginTop: 100,
    flex: 1,
  },
  pressableBackButton: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    top: 25,
    left: 10,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontFamily: "OpenSans-semibold",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontFamily: "sans-serif",
    fontSize: 14,
  },
});
