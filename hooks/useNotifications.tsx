import notifee, { EventType } from "@notifee/react-native";
import { useEffect, useState } from "react";

const useNotifications = () => {
  const [notificationId, setNotificationId] = useState("");

  useEffect(() => {
    if (notificationId) {
      notifee.onBackgroundEvent(async (event) => {
        //
      });
    }
  }, [notificationId]);

  async function onDisplayNotification() {
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
  }

  async function cancelNotification() {
    if (notificationId) await notifee.cancelNotification(notificationId);
  }

  return { onDisplayNotification, notificationId, cancelNotification };
};

export default useNotifications;
