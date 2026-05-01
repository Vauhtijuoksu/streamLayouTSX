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