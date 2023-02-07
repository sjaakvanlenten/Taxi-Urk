import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

type TaxiDriverContextType = {
  taxiId: string;
  setTaxiId: Dispatch<SetStateAction<string | null>>;
};

const taxiDriverContext = createContext<TaxiDriverContextType | undefined>(
  undefined
);

export const TaxiDriverProvider = ({ children }) => {
  const [taxiId, setTaxiId] = useState<string | null>(null);

  return (
    <taxiDriverContext.Provider value={{ taxiId, setTaxiId }}>
      {children}
    </taxiDriverContext.Provider>
  );
};

export default function useTaxiDriverContext(): TaxiDriverContextType {
  return useContext(taxiDriverContext);
}
