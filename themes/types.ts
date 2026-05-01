import { Role } from "@/schema/constant";
import {ReactNode} from "react";
import {layouts} from "@/layouts/list";

export type ThemeProps = {
  extends?: string | string[]
  base: {[key: string]: string}
  night?: {[key: string]: string}
  config?: ThemeConfig
  sponsors?: Sponsor[]
  excludeLayout?: (keyof typeof layouts)[]
}
export type Sponsor = {
  icon: string
  name?: string
  set?: SponsorSet
}
export type SponsorSet = {
  selector: string
  label: string
}
export type SinglePluralHeader = ReactNode | {s: ReactNode, p: ReactNode}
export type ThemeConfig = {
  defaultCornerRadius?: number
  header?: {[K in Role]?: SinglePluralHeader}
  charImgFolder?: string,
  deviceImgFolder?: string,
  bottomBarContent?: BottomBarConfig
}
export type BottomBarConfig = {
  left?: BottomBarSideContent | BottomBarSideContent[],
  mid?: BottomBarMidContent | BottomBarMidContent[],
  right?: BottomBarSideContent | BottomBarSideContent[]
}
export type BottomBarSideContent = "total" | "goal" | "time" | "empty" | "hidden"
export type BottomBarMidContent = "motd" | "schedule" | "incentives" | "donations"
