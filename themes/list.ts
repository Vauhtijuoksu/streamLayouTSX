import debugCss from "./debug.module.css"
import blocksCss from "./blocks.module.css"
import generic from "./generic/"
import vjp25 from "./VJp25/"
import {ThemeConfig, ThemeProps} from "@/themes/types";


export const themes:{[key: string]: ThemeProps} = {
  debug: {base: debugCss},
  blocks: {base: blocksCss},
  generic: generic,
  vjp25: vjp25,
}

export const defaultTheme = themes.generic

export const defaultThemeConfig:ThemeConfig = {
  header: {
    'PLAYER': {s: 'Juoksija', p: 'Juoksijat'},
    'BACKSEAT': 'Sohvalla',
    'STUDIO': 'Studiossa',
  }
}
