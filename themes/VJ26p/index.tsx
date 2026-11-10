import css from "./style.module.css"
import night_css from "./night_style.module.css"
import {ThemeProps} from "@/themes/types";

const theme:ThemeProps = {
  extends: ['generic'],
  base: css,
  night: night_css,
  config: {
    defaultCornerRadius: 26,
    deviceImgFolder: "vj26p",
    charImgFolder: "vj26p",
    bottomBarContent: {
      left: "total",
      mid: ["motd", "schedule", "incentives", "donations"],
      right: "time"
    }
  },
  sponsors: [
    {icon: "azsh_blue.png"},
    {icon: "pestipaevat_black.png"},
    {icon: "RattoRadio_orange.png"},
    {icon: "Vectorama_vaaka_positiivinen.png"},
    {icon: "retrocon.png"},
    {icon: "toeimisto.png", set: {selector: "default", label: "Tapahtumapaikka"}},
  ],
  excludeLayout: []
}

export default theme