import {ReactNode} from "react";
import {LayoutComponentProps} from "@/layouts/list";
import {AspectRatio} from "@/schema/constant";



export type Layout = GameViews & {
  cameras: number
  displayName: string
  description?: string
  component: (props:LayoutComponentProps) => ReactNode
}
type GameViews = {
  gameViews: 0
  aspectRatio?: undefined
} | {
  gameViews: 1
  aspectRatio: AspectRatio
} | {
  gameViews: 2
  aspectRatio: [AspectRatio,AspectRatio] | AspectRatio
} | {
  gameViews: 3
  aspectRatio: [AspectRatio,AspectRatio,AspectRatio] | AspectRatio
} | {
  gameViews: 4
  aspectRatio: [AspectRatio,AspectRatio,AspectRatio,AspectRatio] | AspectRatio
} | {
  gameViews: 5
  aspectRatio: [AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio] | AspectRatio
} | {
  gameViews: 6
  aspectRatio: [AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio] | AspectRatio
} | {
  gameViews: 7
  aspectRatio: [AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio] | AspectRatio
} | {
  gameViews: 8
  aspectRatio: [AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio,AspectRatio] | AspectRatio
}