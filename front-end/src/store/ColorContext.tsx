import { createContext } from "react";

export const colors = {
  white: "rgb(255, 255, 255)",
  cyan: "rgb(0, 255, 255)",
  magenta: "rgb(255, 0, 255)",
  yellow: "rgb(255, 255, 0)",
  red: "rgb(255, 0, 0)",
  green: "rgb(0, 255, 0)",
  blue: "rgb(0, 0, 255)",
  black: "rgb(0, 0, 0)",
} as const;

export const ColorContext = createContext<(typeof colors)[keyof typeof colors]>(
  colors.white
);
