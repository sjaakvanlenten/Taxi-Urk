import { Control } from "react-hook-form";

export type Taxi = {
  id: string;
  isSharingLocation: boolean;
  available: boolean;
  name: string;
  phone: string;
  image: string;
  statusText?: string;
  carModel?: string;
  totalPassengerSeats?: string;
};

export type MyControlType<T> = Control<T, any>;
