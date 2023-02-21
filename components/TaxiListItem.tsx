import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Taxi } from "../typings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const TaxiListItem = ({ taxi }: { taxi: Taxi }) => {
  return (
    <View
      style={{
        height: 80,
        alignItems: "center",
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginBottom: 18,
        borderRadius: 15,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            marginRight: 15,
          }}
        />
        <View>
          <Text
            style={{
              color: "#232428",
              fontFamily: "OpenSans-semibold",
              fontSize: 16,
            }}
          >
            {taxi.name}
          </Text>
          <Text
            style={{
              color: taxi.available ? "#3EB489" : "#Ff2400",
              fontFamily: "OpenSans-regular",
              fontSize: 12,
            }}
          >
            {taxi.available ? "Beschikbaar" : "Afwezig"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={styles.iconContainer}
          android_ripple={{
            color: "#c83c26",
            borderless: true,
            radius: 22,
          }}
          // onPress={() => Linking.openURL(`tel:${taxi.phone}`)}
        >
          <MaterialCommunityIcons name="map-marker" size={28} color="#de432a" />
        </Pressable>
        <Pressable
          style={[{ marginLeft: 20 }, styles.iconContainer]}
          android_ripple={{
            color: "#de932c",
            borderless: true,
            radius: 22,
          }}
          // onPress={() => Linking.openURL(`tel:${taxi.phone}`)}
        >
          <MaterialCommunityIcons name="car-info" size={30} color="#f7a331" />
        </Pressable>
        <Pressable
          style={[{ marginLeft: 20 }, styles.iconContainer]}
          android_ripple={{
            color: "#38a27b",
            borderless: true,
            radius: 22,
          }}
          // onPress={() => Linking.openURL(`tel:${taxi.phone}`)}
        >
          <FontAwesome5 name="phone" size={22} color="#3EB489" />
        </Pressable>
      </View>
    </View>
  );
};

export default TaxiListItem;

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
