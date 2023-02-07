export type Taxi = {
  id: string;
  isSharingLocation: boolean;
  available: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  name: string;
  phone: string;
};
