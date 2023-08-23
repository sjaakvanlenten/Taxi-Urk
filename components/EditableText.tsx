import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  ColorValue,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

interface EditableTextProps {
  validationRules?: Record<string, any>;
  initialValue: string;
  placeHolder?: string;
  iconColor?: ColorValue;
  submitCallback?: (data: string) => void;
}

type FormData = {
  currentInput: string;
};

const Seperator = () => <View style={styles.seperator} />;

const EditableText: React.FC<EditableTextProps> = ({
  validationRules,
  initialValue,
  placeHolder,
  iconColor,
  submitCallback,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const submitHandler = (data: FormData) => {
    setIsEditable(false);
    if (submitCallback) {
      submitCallback(data.currentInput); // Call the submitCallback if it's provided
    }
  };

  const makeTextInputEditable = () => {
    setIsEditable(true);
    focusOn(textInputRef.current);
  };

  const focusOn = (ref: TextInput) => {
    setTimeout(() => ref.focus(), 100);
  };

  const editContainerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: errors.currentInput ? "#B71C1C" : "#1B1B1D",
    borderRadius: 10,
    paddingLeft: 5,
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, isEditable && editContainerStyle]}>
        <CustomInput
          name="currentInput"
          style={[
            styles.textInput,
            isEditable ? styles.editableText : styles.nonEditableText,
          ]}
          blurOnSubmit={false}
          ref={textInputRef}
          placeholder={placeHolder}
          control={control}
          editable={isEditable}
          defaultValue={initialValue}
          onSubmitEditing={handleSubmit(submitHandler)}
          rules={validationRules}
        />
        <Seperator />
        <CustomButton
          onPressHandler={makeTextInputEditable}
          icon={
            <Feather
              name="edit-2"
              size={20}
              color={iconColor ? iconColor : "black"}
            />
          }
          color="white"
          height={40}
          width={40}
          buttonStyle={{ borderRadius: 40 / 2, marginRight: 10 }}
        />
      </View>
      {/* Error message */}
      {errors.currentInput && (
        <Text style={styles.errorMessage}>
          {errors.currentInput.message?.toString() || "Error"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    paddingLeft: 8,
    flex: 1,
    fontFamily: "OpenSans-medium",
    fontSize: 16,
    textAlign: "left",
    color: "#010101",
  },
  editableText: {
    color: "#010101",
  },
  nonEditableText: {
    color: "#010101",
  },
  editButton: {
    marginLeft: 10,
  },
  errorMessage: {
    color: "#B71C1C",
    marginTop: 5,
    fontSize: 14,
  },
  seperator: {
    marginRight: 10,
    height: "80%",
    width: 1.5,
    backgroundColor: "#ddd",
  },
});

export default EditableText;
