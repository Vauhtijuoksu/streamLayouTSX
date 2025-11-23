import css from "./style.module.css"
import {ThemeProps} from "@/themes/types";

const theme:ThemeProps = {
  extends: ['generic'],
  base: css,
  config: {
    defaultCornerRadius: 30,
    deviceImgFolder: "generic",
    charImgFolder: "vjp25"
  },
  sponsors: [
    "WWF.jpg",
    "azsh_blue.png",
    "pestipaevat_white.png",
    "pop_pankki.png",
    "PSOAS.png",
    "TEK_white.png",
    "Tiedot_white.svg",
    "Tullisali_white.svg",
    "RattoRadio_orange.png",
    "vectorama_white.png",
  ],
  excludeLayout: []
}

export default theme