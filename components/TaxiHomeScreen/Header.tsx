import { FC } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import useTheme from "../../context/theme-context";

interface HeaderProps {
  pressableCallback: () => void;
  image: string;
}

const Header: FC<HeaderProps> = ({ pressableCallback, image }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileImageContainer}>
        {image && <Image source={{ uri: image }} style={styles.profileImage} />}
      </View>

      <Text style={styles.headerText}>Welkom</Text>
      <Pressable
        android_ripple={{ borderless: true }}
        onPress={pressableCallback}
      >
        <MaterialCommunityIcons
          name="account-edit"
          size={30}
          color={theme.black}
        />
      </Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    height: 60,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 10,
  },
  headerText: {
    fontFamily: "OpenSans-semibold",
    fontSize: 20,
  },
  profileImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: "red",
    borderRadius: 48 / 2,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    aspectRatio: 1,
  },
});
