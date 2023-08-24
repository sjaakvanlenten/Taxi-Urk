import { TextInput, TextInputProps as RNTextInputProps } from "react-native";
import { Controller } from "react-hook-form";
import { forwardRef } from "react";
import { MyControlType } from "../../types/typings";

interface InputProps<T>
  extends Omit<RNTextInputProps, "defaultValue" | "onChange"> {
  control: MyControlType<T>;
  rules?: {};
  defaultValue?: string;
  name: string;
}

const CustomInput = forwardRef<TextInput, InputProps<any>>(
  ({ control, rules = {}, defaultValue, name, ...props }, ref) => {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue !== undefined ? defaultValue : undefined}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            ref={ref}
            textAlign="center"
            {...props}
          />
        )}
      />
    );
  }
);

export default CustomInput;
