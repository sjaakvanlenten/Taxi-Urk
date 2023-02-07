import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Welcome: undefined;
  CreateNewTaxi: undefined;
  TaxiHome: { taxiRef: string };
  ClientHome: undefined;
  TestingScreen: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
