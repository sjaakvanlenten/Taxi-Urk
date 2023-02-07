export type Taxi = {
  id: string;
  available: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  name: string;
  phone: string;
};
