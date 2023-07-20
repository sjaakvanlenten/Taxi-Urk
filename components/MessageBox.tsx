import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEventData,
  View,
} from "react-native";
import CustomButton from "./CustomButton";
import { FC, useEffect, useRef, useState } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
interface MessageBoxProps {
  placeholderText?: string;
  data?: string;
  submitHandler: (text: string) => void;
  deleteHandler: () => void;
  undoButtonColor?: string;
  deleteButtonColor?: string;
  submitButtonColor?: string;
  currentData?: string;
}

const MessageBox: FC<MessageBoxProps> = ({
  placeholderText,
  data,
  submitHandler,
  deleteHandler,
  undoButtonColor,
  deleteButtonColor,
  submitButtonColor,
  currentData,
}) => {
  const [statusText, setstatusText] = useState(data);
  const [inputHeight, setInputHeight] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  const prevInputHeight = useRef<number>();

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    event.persist();
    setInputHeight((prev) => {
      prevInputHeight.current = prev;
      return event.nativeEvent.contentSize.height;
    });
  };

  const handleSubmit = () => {
    submitHandler(statusText);
    Keyboard.dismiss();
  };

  const handleClearInput = () => {
    setstatusText("");
    setInputHeight(40);
  };

  const handleDelete = () => {
    deleteHandler();
    Keyboard.dismiss();
  };

  const handleUndo = () => {
    setstatusText(data);
    if (prevInputHeight.current > 0) setInputHeight(prevInputHeight.current);
  };

  useEffect(() => {
    setstatusText(currentData || ""); // Set the new statusText value
  }, [currentData]);

  return (
    <View style={styles.messageBox}>
      {data.length > 0 && (
        <CustomButton
          onPressHandler={handleDelete}
          icon={
            <MaterialIcons name="delete-outline" size={26} color="#696969" />
          }
          height={30}
          color="#ffffff"
          buttonTextStyle={{ fontSize: 12 }}
          buttonStyle={{
            position: "absolute",
            right: 5,
            top: 5,
            zIndex: 5,
          }}
        />
      )}
      <TextInput
        value={statusText}
        placeholder={placeholderText}
        onContentSizeChange={handleContentSizeChange}
        multiline={true}
        onChangeText={(text) => setstatusText(text)}
        onFocus={() => setShowButtons(true)}
        onBlur={() => setShowButtons(false)}
        style={{
          height: Math.min(120, Math.max(41, inputHeight)),
          textAlignVertical: "top",
          padding: 10,
          fontSize: 16,
        }}
      />

      {showButtons && (
        <View style={styles.buttonBar}>
          <CustomButton
            onPressHandler={handleClearInput}
            icon={<Ionicons name="md-close-sharp" size={20} color="#696969" />}
            height={28}
            color="#ffffff"
            buttonTextStyle={{ fontSize: 12 }}
          />
          <CustomButton
            onPressHandler={handleUndo}
            icon={<FontAwesome name="undo" size={18} color="#696969" />}
            color="#ffffff"
            height={28}
            buttonTextStyle={{ fontSize: 12 }}
          />
          <CustomButton
            onPressHandler={handleSubmit}
            active={statusText !== data}
            height={28}
            icon={
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={statusText !== data ? "white" : "#666666"}
                style={{ marginRight: 8 }}
              />
            }
            rippleColor={submitButtonColor}
            color={submitButtonColor}
            buttonTextStyle={{ fontSize: 14 }}
          >
            Opslaan
          </CustomButton>
        </View>
      )}
    </View>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  buttonBar: {
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
    padding: 5,
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
});
