import css from "./style.module.css"
import {ThemeProps} from "@/themes/types";

const theme:ThemeProps = {
  extends: ['generic'],
  base: css,
  config: {
    defaultCornerRadius: 40,
    deviceImgFolder: "vj26",
    charImgFolder: "vj26",
    bottomBarContent: {
      left: "total",
      mid: ["motd", "schedule", "incentives", "donations"],
      right: "time"
    }
  },
  sponsors: [
    {icon: "sairaalaklovnit.png", set: {selector: "default", label: "Keräyskohde"}},
    {icon: "azsh_blue.png"},
    {icon: "TEK_rbg.png"},
    {icon: "pestipaevat_black.png"},
    {icon: "emuurom.png"},
    {icon: "dom_ant_games.png"},
    {icon: "RattoRadio_orange.png"},
    {icon: "vectorama_white.png"},
    {icon: "toeimisto.png", set: {selector: "default", label: "Tapahtumapaikka"}},
    {icon: "kili.png", set: {selector: "pause", label: "Taukosnäksit tarjoaa"}},
    {icon: "oikia.png", set: {selector: "pause", label: "Taukosnäksit tarjoaa"}},
  ],
  excludeLayout: []
}

export default theme