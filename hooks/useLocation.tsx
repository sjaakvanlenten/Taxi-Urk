import { useState, useEffect } from "react";
import {
  Accuracy,
  LocationCallback,
  LocationSubscription,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";

export default (shouldTrack: boolean, callback: LocationCallback) => {
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let subscriber: LocationSubscription;
    const startTracking = async () => {
      try {
        const { granted } = await requestForegroundPermissionsAsync();
        if (!granted) {
          throw new Error("Geen toegang tot locatie");
        }
        subscriber = await watchPositionAsync(
          {
            accuracy: Accuracy.BestForNavigation,
            timeInterval: 3000,
          },
          callback
        );
      } catch (e) {
        setErrorMsg(e);
      }
    };

    if (shouldTrack) {
      startTracking();
    } else {
      if (subscriber) {
        subscriber.remove();
      }
      subscriber = null;
    }

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [shouldTrack, callback]);

  return [errorMsg];
};
