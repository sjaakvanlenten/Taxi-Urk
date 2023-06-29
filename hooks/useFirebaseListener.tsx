import { useEffect, useState } from "react";
import {
  DataSnapshot,
  Query,
  Unsubscribe,
  onValue,
  ref,
} from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export type ListenerCallback<T> = (snapshot: DataSnapshot) => Promise<T> | T;

interface UseFirebaseListenerOptions<T> {
  query?: Query;
  callback?: ListenerCallback<T>;
  isActiveByDefault?: boolean;
}

const useFirebaseListener = <T,>({
  query,
  callback,
  isActiveByDefault = false,
}: UseFirebaseListenerOptions<T>) => {
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
        async (snapshot) => {
          if (callback) {
            try {
              const result = await callback(snapshot);
              setData(result);
            } catch (error) {
              setError(error);
            }
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
