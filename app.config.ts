import { ExpoConfig, ConfigContext } from "expo/config";
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "Taxi-Urk",
    name: "Taxi-Urk",
    android: {
      package: "com.sjaakvanlenten.TaxiUrk",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_API_KEY,
        },
      },
    },
  };
};
