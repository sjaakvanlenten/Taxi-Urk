import { FC } from "react";
import { StyleSheet, Text, View, Switch, SwitchProps } from "react-native";
import { Theme } from "../../themes/theme";

interface ControlBarProps extends SwitchProps {
  title: string;
  status: string;
  isActive?: boolean;
  switchState: boolean;
  onSwitchChange: () => void;
  theme: Theme;
}

const ControlBar: FC<ControlBarProps> = ({
  title,
  status,
  isActive = true,
  switchState,
  onSwitchChange,
  theme,
}) => {
  return (
    <View style={styles.settingsBar}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.statusText}>{status}</Text>

        <Switch
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          trackColor={{
            false: isActive ? "#767577" : "#e4e3e4",
            true: theme.primary,
          }}
          thumbColor={isActive ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onSwitchChange}
          value={switchState}
          disabled={!isActive}
        />
      </View>
    </View>
  );
};

export default ControlBar;

const styles = StyleSheet.create({
  settingsBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 60,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
  },
  switchContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 3,
    fontFamily: "OpenSans-regular",
    fontSize: 16,
  },
  statusText: {
    fontFamily: "OpenSans-semibold",
    fontSize: 18,
  },
});
