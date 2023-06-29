import notifee, { Event, EventType } from "@notifee/react-native";
import { useEffect, useState } from "react";

const useNotifications = () => {
  const [notificationId, setNotificationId] = useState<string | null>("");

  useEffect(() => {
    const handleBackgroundEvent = async (event: Event) => {
      // Handle background events if needed
    };

    if (notificationId) {
      notifee.onBackgroundEvent(handleBackgroundEvent);
    }
  }, [notificationId]);

  const onDisplayNotification = async () => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    const notification = await notifee.displayNotification({
      title: "Taxi",
      body: "Uw taxi staat als beschikbaar",
      android: {
        channelId,
        pressAction: {
          id: "default",
        },
        autoCancel: false,
      },
    });
    setNotificationId(notification);
  };

  const cancelNotification = async () => {
    if (notificationId) {
      await notifee.cancelNotification(notificationId);
      setNotificationId(null);
    }
  };

  return { onDisplayNotification, notificationId, cancelNotification };
};

export default useNotifications;
