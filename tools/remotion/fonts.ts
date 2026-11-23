import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const font = "Framecraft Sans, sans-serif";

void Promise.all([
  loadFont({
    family: "Framecraft Sans",
    url: staticFile("shared/fonts/motion-regular.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "Framecraft Sans",
    url: staticFile("shared/fonts/motion-bold.woff2"),
    weight: "700",
  }),
]);
