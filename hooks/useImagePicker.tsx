import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

export const STORAGE_KEY = "selectedImage";

const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedImage = await SecureStore.getItemAsync(STORAGE_KEY);
      if (storedImage) {
        setSelectedImage(storedImage);
      }
    })();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("Toegang tot media geweigerd.");
      return false;
    }
    return true;
  };

  const handleImagePicker = async () => {
    try {
      const permissionsGranted = await requestPermissions();

      if (!permissionsGranted) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const image = result.assets[0].uri;
        setSelectedImage(image);
        await SecureStore.setItemAsync(STORAGE_KEY, image);
        return image;
      }
    } catch (error) {
      setErrorMessage("Er is een fout opgetreden.");
    }
  };

  return { selectedImage, errorMessage, handleImagePicker };
};

export default useImagePicker;
