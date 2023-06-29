import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { Taxi } from "../types/typings";

type TaxiDriverContextType = {
  taxi: Taxi;
  setTaxi: Dispatch<SetStateAction<Taxi | null>>;
};

const taxiDriverContext = createContext<TaxiDriverContextType | undefined>(
  undefined
);

type TaxiDriverProviderProps = {
  children: ReactNode;
};

export const TaxiDriverProvider = ({ children }: TaxiDriverProviderProps) => {
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
