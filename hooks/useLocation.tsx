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
import * as SecureStore from "expo-secure-store";

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
      const taxiId = await SecureStore.getItemAsync("user");
      updateLocation(taxiId, locations[0]?.coords);
    }
  }
);

const useLocation = (shouldTrack: boolean) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setErrorMsg(e.message);
      }
    };

    const stopTracking = async () => {
      const tracking = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TRACKING
      );
      if (tracking) {
        await stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    };

    if (shouldTrack) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [shouldTrack]);

  return [errorMsg];
};

export default useLocation;
