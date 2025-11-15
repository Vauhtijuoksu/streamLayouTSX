import { Role } from "@/schema/constant";
import {ReactNode} from "react";
import {layouts} from "@/layouts/list";

export type ThemeProps = {
  extends?: string | string[]
  base: {[key: string]: string}
  night?: {[key: string]: string}
  config?: ThemeConfig
  sponsors?: string[]
  excludeLayout?: (keyof typeof layouts)[]
}
export type SinglePluralHeader = ReactNode | {s: ReactNode, p: ReactNode}
export type ThemeConfig = {
  defaultCornerRadius?: number
  header?: {[K in Role]?: SinglePluralHeader}
  imagePath?: {
    default?: string
    [key:string]: string | null | undefined
  }
}
