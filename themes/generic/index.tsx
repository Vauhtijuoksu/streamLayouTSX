import css from "./style.module.css"
import {ThemeProps} from "@/themes/types";

const theme:ThemeProps = {
  extends: ['blocks'],
  base: css,
  config: {
    defaultCornerRadius: 30
  },
  sponsors: []
}

export default theme