import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

type ContextType = {
  locations: {};
  setLocations: Dispatch<SetStateAction<any>>;
};

const testContext = createContext<ContextType | undefined>(undefined);

export const TestProvider = ({ children }) => {
  const [locations, setLocations] = useState<any>({});

  return (
    <testContext.Provider value={{ locations, setLocations }}>
      {children}
    </testContext.Provider>
  );
};

export default function useTestContext(): ContextType {
  return useContext(testContext);
}
