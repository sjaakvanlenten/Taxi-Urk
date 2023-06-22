import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as SecureStore from "expo-secure-store";
import { storage } from "../firebase/firebaseConfig";

const useFirebaseStorage = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState("");

  const uploadFile = async (
    fileUri: Blob | Uint8Array | ArrayBuffer,
    fileName: string
  ) => {
    try {
      const storageRef = ref(storage, "images/profiles/" + fileName);
      const uploadTask = uploadBytesResumable(storageRef, fileUri);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const downloadFile = async (id: string) => {
    const cachedImage = await SecureStore.getItemAsync(id);
    if (cachedImage) {
      setDownloadURL(cachedImage);
      return;
    }

    const imageURI = await getDownloadURL(
      ref(storage, "images/profiles/" + id + ".png")
    ).catch((error) => {
      if (error.code === "storage/object-not-found") {
        return;
      }
    });

    if (imageURI) {
      await SecureStore.setItemAsync(id, imageURI);
      setDownloadURL(imageURI);
    }
  };

  return { uploadFile, uploadProgress, downloadFile, downloadURL };
};

export default useFirebaseStorage;
