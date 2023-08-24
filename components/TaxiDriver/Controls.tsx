import { FC } from "react";
import { Dimensions, View } from "react-native";
import { Path, Svg } from "react-native-svg";

import useTheme from "../../context/theme-context";
import MessageBox from "./MessageBox";
import ControlBar from "./ControlBar";

const windowWidth = Dimensions.get("window").width;
const bumpWidth = 20;
const topHeight = 60;

interface ControlProps {
  statusText: string;
  isAvailable: boolean;
  isSyncingLocation: boolean;
  toggleAvailability: () => void;
  toggleLocationSharing: () => void;
  statusTextSubmitHandler: (text: string) => void;
  statusTextDeleteHandler: () => void;
}

const Controls: FC<ControlProps> = ({
  statusText,
  isAvailable,
  isSyncingLocation,
  toggleAvailability,
  toggleLocationSharing,
  statusTextSubmitHandler,
  statusTextDeleteHandler,
}) => {
  const { theme } = useTheme();
  return (
    <View>
      <Svg
        height="100"
        width={windowWidth + bumpWidth * 2}
        viewBox={`0 0 ${windowWidth + bumpWidth * 2} 100`}
        fill={theme.primary}
        style={{
          position: "absolute",
          top: -100,
        }}
      >
        <Path
          d={`M${-bumpWidth} 100 Q ${windowWidth / 2} ${100 - topHeight}, ${
            windowWidth + bumpWidth
          } 100 H ${-bumpWidth} Z`}
        />
      </Svg>

      <View style={{ backgroundColor: theme.primary, rowGap: 20, padding: 10 }}>
        <ControlBar
          title="Beschikbaarheid"
          status={isAvailable ? "Online" : "Offline"}
          switchState={isAvailable}
          onSwitchChange={toggleAvailability}
          theme={theme}
        />
        <ControlBar
          title="Locatie Delen"
          status={isSyncingLocation ? "Aan" : "Uit"}
          isActive={isAvailable}
          switchState={isSyncingLocation}
          onSwitchChange={toggleLocationSharing}
          theme={theme}
        />
        <MessageBox
          placeholderText="Status Bericht..."
          data={statusText}
          submitHandler={statusTextSubmitHandler}
          deleteHandler={statusTextDeleteHandler}
          submitButtonColor={theme.confirmButton}
          deleteButtonColor={theme.deleteButton}
          undoButtonColor={theme.background}
          currentData={statusText}
        />
      </View>
    </View>
  );
};

export default Controls;
