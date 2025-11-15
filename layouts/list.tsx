import {Layout} from "@/layouts/types";
import {sixteenNine} from "@/layouts/sixteenNine/SixteenNine";
import {sixteenNineDuo} from "@/layouts/sixteenNine/SixteenNineDuo";
import {sixteenNineDuoSplitCam} from "@/layouts/sixteenNine/SixteenNineDuoSplitCam";
import {
  sixteenNineDuoCorneredLeftOnTop,
  sixteenNineDuoCorneredRightOnTop
} from "@/layouts/sixteenNine/SixteenNineDuoCornered";
import {fourThree} from "@/layouts/fourThree/FourThree";
import {fourThreeDuo} from "@/layouts/fourThree/FourThreeDuo";
import {fourThreeDuoSplitCam} from "@/layouts/fourThree/FourThreeDuoSplitCam";
import {pause} from "@/layouts/pause/Pause";
import {pauseFullCam} from "@/layouts/pause/PauseFullCam";
import {yapping} from "@/layouts/pause/Yapping";
import {yappingDuoCam} from "@/layouts/pause/YappingDuoCam";
import {componentList} from "@/layouts/components/ComponentList";

export type LayoutComponentProps = object | undefined

export const layouts:{[key: string]:Layout} = {
  sixteenNine,
  sixteenNineDuo,
  sixteenNineDuoSplitCam,
  sixteenNineDuoCorneredRightOnTop,
  sixteenNineDuoCorneredLeftOnTop,
  fourThree,
  fourThreeDuo,
  fourThreeDuoSplitCam,
  pause,
  pauseFullCam,
  yapping,
  yappingDuoCam,
  componentList
}
