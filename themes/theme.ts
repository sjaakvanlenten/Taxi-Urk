import { mapStyle } from "../mapStyle";

export const light = {
  name: "light",
  primary: "#f7b731",
  background: "#f9b55a",
  listItemBackground: "#f2f2f2",
  iconBackGround: "#f2f2f2",
  bottomSheetLine: "#ffffff",
  textColor: "#1B1B1D",
  black: "#1B1B1D",
  greyBorder: "#e8e8e8",
  primaryRGB: "rgba(247,183,49,0.8)",
  blackRGB: "rgba(36,36,38,0.3)",
  mapStyle: [],
};

export const dark = {
  name: "dark",
  primary: "#F7b731",
  background: "#1B1B1D",
  listItemBackground: "#282a36",
  iconBackGround: "#f7a331",
  bottomSheetLine: "#E3e3e3",
  textColor: "#E3e3e3",
  black: "#242426",
  greyBorder: "#e8e8e8",
  primaryRGB: "rgba(247,183,49,0.8)",
  blackRGB: "rgba(36,36,38,0.3)",
  mapStyle: mapStyle,
};

export type Theme = typeof light;
