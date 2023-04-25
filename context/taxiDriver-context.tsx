import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Taxi } from "../typings";

type TaxiDriverContextType = {
  taxi: Taxi;
  setTaxi: Dispatch<SetStateAction<Taxi | null>>;
};

const taxiDriverContext = createContext<TaxiDriverContextType | undefined>(
  undefined
);

export const TaxiDriverProvider = ({ children }) => {
  const [taxi, setTaxi] = useState<Taxi | null>(null);

  return (
    <taxiDriverContext.Provider value={{ taxi, setTaxi }}>
      {children}
    </taxiDriverContext.Provider>
  );
};

export default function useTaxiDriverContext(): TaxiDriverContextType {
  return useContext(taxiDriverContext);
}
