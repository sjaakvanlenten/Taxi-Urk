import { useCallback, useRef } from "react";
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
import { useForm, useFormState } from "react-hook-form";
import * as SecureStore from "expo-secure-store";
import { Feather } from "@expo/vector-icons";

import { queryByPhoneNumber } from "../../firebase/queries";
import { RootStackScreenProps } from "../../navigation/types";
import CustomButton from "../../components/UI/CustomButton";
import CustomInput from "../../components/UI/CustomInput";

import { pushNewTaxiRef } from "../../firebase/mutations";
import { resetNavigationState } from "../../navigation/actions";
import { light } from "../../themes/theme";
import useTaxiDriverContext from "../../context/taxiDriver-context";
import useTheme from "../../context/theme-context";

export interface FormData {
  name: string;
  phoneNumber: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CreateNewTaxiScreen: React.FC = () => {
  const { theme } = useTheme();
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

  const { setTaxi } = useTaxiDriverContext();

  const addTaxiUserToDatabase = (data: FormData) => {
    const query = queryByPhoneNumber(data.phoneNumber);

    get(query).then((snapshot) => {
      if (!snapshot.exists()) {
        try {
          //push to db
          pushNewTaxiRef(data).then((newTaxiRef) => {
            //push to local secureStore
            SecureStore.setItemAsync("user", newTaxiRef.key).then(() => {
              //set application context
              setTaxi({
                id: newTaxiRef.key,
                isSharingLocation: false,
                available: false,
                name: data.name,
                image: "https://i.pravatar.cc/300",
                phone: data.phoneNumber,
              });
              resetNavigationState(navigation);
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

  const submitHandler = (data: FormData) => addTaxiUserToDatabase(data);

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: theme.primary }}
      horizontal
      pagingEnabled
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.pageContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Wat is je naam?</Text>

          <CustomInput
            name="name"
            placeholder="Naam"
            control={control}
            style={styles.input}
          />
        </View>
        <CustomButton
          height={40}
          color={theme.black}
          buttonStyle={{ borderRadius: 10 }}
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
              style={styles.input}
              rules={{
                required: "Geef een geldig telefoonnummer op",

                pattern: {
                  value: /^((\+316|06|00316){1}\s?-?\s?[1-9]{1}[0-9]{7})$/,
                  message: "Geef een geldig 06-nummer op",
                },
              }}
              control={control}
            />
            {/* Error message */}
            {errors.phoneNumber && (
              <Text style={styles.errorMessage}>
                {errors.phoneNumber?.message?.toString() || "Error"}
              </Text>
            )}
          </View>
          <CustomButton
            onPressHandler={handleSubmit(submitHandler)}
            active={isValid}
            color={theme.black}
            buttonStyle={{ borderRadius: 10 }}
            height={40}
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
  input: {
    backgroundColor: "white",
    borderColor: light.greyBorder,
    borderWidth: 2,
    borderRadius: 20,
    fontSize: 15,
    fontFamily: "OpenSans-semibold",
    alignSelf: "stretch",
    color: "black",
    padding: 10,
    marginVertical: 5,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontFamily: "OpenSans-semibold",
    marginBottom: 20,

    alignSelf: "stretch",
    textAlign: "center",
  },
  errorMessage: {
    color: "#B71C1C",
    marginTop: 5,
    fontSize: 14,
  },
});
