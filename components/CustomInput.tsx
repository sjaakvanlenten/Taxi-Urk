import { StyleSheet, Text, TextInput, View } from "react-native";
import { Controller, Control } from "react-hook-form";
import React from "react";
import { FormData } from "../screens/Taxi/CreateNewTaxiScreen";
import { light } from "../themes/theme";

interface InputProps {
  control: Control<FormData, any>;
  rules?: {};
  name: string;
  placeholder: string;
}

const CustomInput: React.FC<InputProps> = ({
  control,
  rules = {},
  name,
  placeholder,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <TextInput
              textAlign="center"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
            />
          </View>
          {error && (
            <Text style={{ color: "red", alignSelf: "stretch" }}>
              {error.message || "Error"}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignSelf: "stretch",
    borderColor: light.greyBorder,
    borderWidth: 2,
    borderRadius: 20,

    padding: 10,
    marginVertical: 5,
  },
  input: {
    fontSize: 15,
    fontFamily: "OpenSans-semibold",
  },
});
