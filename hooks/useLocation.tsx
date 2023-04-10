import { useState, useEffect } from "react";
import {
  Accuracy,
  LocationObject,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from "expo-location";
import * as TaskManager from "expo-task-manager";
import { TaskManagerTaskBody } from "expo-task-manager";

import { updateLocation } from "../firebase/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCATION_TRACKING = "background-location-task";

type TaskBodyProps = {
  locations: LocationObject[];
};

TaskManager.defineTask(
  LOCATION_TRACKING,
  async ({
    data: { locations },
    error,
  }: TaskManagerTaskBody<TaskBodyProps>) => {
    if (error) {
      console.log(error);
      return;
    }
    if (locations) {
      const taxiId = await AsyncStorage.getItem("@user");
      console.log(taxiId, locations);
      updateLocation(taxiId, locations[0]?.coords);
    }
  }
);

export default (shouldTrack: boolean) => {
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      try {
        const { granted: foregroundStatus } =
          await requestForegroundPermissionsAsync();
        if (!foregroundStatus) {
          throw new Error("Geen toegang tot locatie");
        }
        const { granted: backgroundStatus } =
          await requestBackgroundPermissionsAsync();
        if (!backgroundStatus) {
          throw new Error("Geen toegang tot locatie");
        }
        await startLocationUpdatesAsync(LOCATION_TRACKING, {
          accuracy: Accuracy.BestForNavigation,
          showsBackgroundLocationIndicator: true,
          deferredUpdatesInterval: 100,
          foregroundService: {
            notificationTitle: "Taxi Urk",
            notificationBody: "Locatie delen actief",
            notificationColor: "#f7a331",
          },
        });
      } catch (e) {
        setErrorMsg(e);
      }
    };

    if (shouldTrack) {
      startTracking();
    } else {
      TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
        if (tracking) {
          console.log(tracking);
          stopLocationUpdatesAsync(LOCATION_TRACKING);
        }
      });
    }
  }, [shouldTrack]);

  return [errorMsg];
};
