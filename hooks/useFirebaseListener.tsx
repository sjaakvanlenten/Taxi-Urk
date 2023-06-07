import { useEffect, useState } from "react";
import { Query, Unsubscribe, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

type ListenerCallback = (snapshot: any) => void;

interface UseFirebaseListenerOptions {
  query?: Query;
  callback?: ListenerCallback;
  isActiveByDefault?: boolean;
}

const useFirebaseListener = ({
  query,
  callback,
  isActiveByDefault = false,
}: UseFirebaseListenerOptions) => {
  const [isListenerActive, setIsListenerActive] = useState(isActiveByDefault);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState(null);

  const databaseRef = ref(db);

  useEffect(() => {
    const listenerQuery = query ? query : databaseRef;

    let listener: Unsubscribe;

    if (isListenerActive) {
      listener = onValue(
        listenerQuery,
        (snapshot) => {
          if (callback) {
            const result = callback(snapshot);
            setData(result);
          }
        },
        (error) => {
          setError(error);
        }
      );
    }

    return () => {
      if (listener) {
        listener();
      }
    };
  }, [query, callback, isListenerActive]);

  return {
    data,
    error,
    setIsListenerActive,
  };
};

export default useFirebaseListener;
