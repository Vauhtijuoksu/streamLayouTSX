import css from "./style.module.css"
import {ThemeProps} from "@/themes/types";

const theme:ThemeProps = {
  extends: ['generic'],
  base: css,
  config: {
    defaultCornerRadius: 40,
    deviceImgFolder: "vj26",
    charImgFolder: "vj26"
  },
  sponsors: [
    {icon: "WWF.jpg", set: {selector: "default", label: "Keräyskohteena"}},
    {icon: "azsh_blue.png"},
    {icon: "pestipaevat_white.png"},
    {icon: "pop_pankki.png"},
    {icon: "PSOAS.png"},
    {icon: "TEK_white.png"},
    {icon: "Tiedot_white.svg"},
    {icon: "Tullisali_white.svg"},
    {icon: "RattoRadio_orange.svg"},
    {icon: "vectorama_white.svg"},
  ],
  excludeLayout: []
}

export default theme