import { ExpoConfig, ConfigContext } from "expo/config";
import { GOOGLE_API_KEY } from "react-native-dotenv";
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "Taxi-Urk",
    name: "Taxi-Urk",
    android: {
      config: {
        googleMaps: {
          apiKey: GOOGLE_API_KEY,
        },
      },
    },
  };
};
