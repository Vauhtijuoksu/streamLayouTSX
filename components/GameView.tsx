import {AspectRatio, aspectRatios, v2, Vec2} from "@/schema/constant";
import {CSSProperties, ReactNode, useContext, useEffect, useId, useMemo, useRef, useState} from "react";
import {useCounter, useCurrentGameData, useTimer} from "@/DataHandler/DataProvider";
import {Slot, SlotContext} from "@/DataHandler/SlotProvider";
import {CounterDisplay} from "@/components/Display/Counter";
import {TimerDisplay} from "@/components/Display/Timer";
import {PersonDisplay} from "@/components/Display/Person";
import {type} from "node:os";
import {MaskContext, MaskStatusContext} from "@/components/Holes/Masker";
import masking from "./Holes/Masking.module.css"
import {useConfig, useStyle} from "@/themes/ThemeContext";
import {getRoundedCorners, HoleAdder, RoundedCorners} from "@/components/Holes/Hole";

type Grid = (string)[][]
type InputGrid = (number | string | null)[][] | undefined

const toGrid = (g:InputGrid):Grid => {
  if (typeof g == 'undefined' || !g) return gridPreset.default
  return g.map((gb) => {
    return gb.map((v)=>{
      if (v === null) return "."
      return String(v)
    })
  })
}

type DefaultDisplayData = (number | undefined)[][]
type DefaultDisplay = {
  player?: DefaultDisplayData
  timer?: DefaultDisplayData
  counter?: DefaultDisplayData
}

const toDefaultDisplay = (inDD: undefined | DefaultDisplay, g:Grid):DefaultDisplay => {
  const outDD:DefaultDisplay = {
    player: undefined,
    timer: undefined,
    counter: undefined,
  }
  if (typeof inDD == 'undefined') return outDD
  if (checkDDOK(inDD.player, g)) outDD.player = {...inDD.player as DefaultDisplayData}
  if (checkDDOK(inDD.timer, g)) outDD.timer = {...inDD.timer as DefaultDisplayData}
  if (checkDDOK(inDD.counter, g)) outDD.player = {...inDD.counter as DefaultDisplayData}
  return outDD
}

const checkDDOK = (dd: undefined | DefaultDisplayData, g:Grid) =>{
  let ok = true
  if (!dd || dd.length != g.length) return false
  g.forEach((gr, index) => {
    if (gr.length != dd[index].length) ok = false
  })
  return ok
}


export const gridPreset:{[key:string]: Grid} = {
  default: [["default"]],
  splitV: [["left","right"]],
  splitH: [["top"],["bottom"]],
  four: [["topL", "topR"],["bottomL", "bottomR"]]
}


type GameViewDefaults = {
  id: number | string,
  children?: ReactNode,
  defaultDisplay?: {
    player?: DefaultDisplayData
    timer?: DefaultDisplayData
    counter?: DefaultDisplayData
  }
  roundedCorners?: Partial<RoundedCorners<boolean>> | boolean,
  grid?: InputGrid
  gap?: Vec2 | number
}

interface GameViewSizingNoHeight extends GameViewDefaults {
  ratio: AspectRatio
  width: number
  height?: undefined
}
interface GameViewSizingNoWidth extends GameViewDefaults {
  ratio: AspectRatio
  height: number
  width?: undefined
}
interface GameViewSizingNoRatio extends GameViewDefaults {
  ratio?: undefined
  height: number
  width: number
}
type GameViewProps = GameViewSizingNoHeight | GameViewSizingNoWidth | GameViewSizingNoRatio


export const GameView = ({
  id,
  ratio: inRatio,
  grid: inGrid,
  gap: inGap,
  width: inWidth,
  height: inHeight,
  roundedCorners: inCr,
  defaultDisplay: inDefaultDisplay,
  children,
}:GameViewProps) => {
  const ratio:Vec2 = typeof inRatio != 'undefined' ? (typeof inRatio != "object" ? aspectRatios[inRatio] : inRatio) : v2(inWidth, inHeight)
  const width = inWidth ?? (inHeight/ratio.y)*ratio.x
  const height = inHeight ?? (inWidth/ratio.x)*ratio.y
  const gap = typeof inGap == 'number' ? v2(inGap) : typeof inGap == 'undefined' ? v2(0) : inGap
  const grid = toGrid(inGrid)
  const defaultDisplay = toDefaultDisplay(inDefaultDisplay, grid)
  const areas:{[key:string]: ReactNode} = {}
  const template:string[] = []
  const simple = (grid.length == 1 && grid[0].length == 1 && grid[0][0] == "default")
  const viewID = typeof id == 'string' ? "V_"+id : "VIEW_" + String(id)
  const style = useStyle()

  const isMasked = useContext(MaskStatusContext)

  grid.forEach((gr, y) => {
    template.push(gr.join(" "))
    gr.forEach((a, x) => {
      const ddd:GameViewSplitProps['ddd'] = {
        player: defaultDisplay.player ? defaultDisplay.player[y][x]  : undefined,
        timer: defaultDisplay.timer ? defaultDisplay.timer[y][x] : undefined,
        counter: defaultDisplay.counter ? defaultDisplay.counter[y][x] : undefined,
      }
      if (a != "." && !(a in areas)) areas[a] = <GameViewSplit key={y*100+x} area={a} simple={simple} viewID={viewID} ddd={ddd}/>
    })
  })

  const {defaultCornerRadius: dcr} = useConfig()
  const cr = getRoundedCorners(inCr, dcr ?? 0)

  const borderRadius:CSSProperties = {borderRadius: (typeof cr == "number" ? cr + "px" : `${cr.topL + "px"} ${cr.topR + "px"} ${cr.bottomR + "px"} ${cr.bottomL + "px"}`)}

  return (
    <HoleAdder id={viewID} roundedCorners={cr}>
      <div className={[style.border, masking.overlay].join(" ")} style={{
        width: width + "px",
        height: height + "px",
        display: "grid",
        gridGap: gap.x + "px " + gap.y + "px",
        gridTemplateAreas: `"${template.join(`" "`)}"`, ...borderRadius
      }}>
        {Object.values(areas)}
      </div>
      <div className={masking.overlay} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>{children}</div>
    </HoleAdder>
  )
}

type GameViewSplitProps = {
  area: string
  simple?: boolean
  viewID: string
  ddd: {
    player?: number
    counter?: number,
    timer?: number
  }
}

const GameViewSplit = ({
  area,
  simple,
  viewID,
  ddd,
}:GameViewSplitProps) => {
  const defaultData:Slot['data'] = {
    player: typeof ddd.player != 'undefined' ? [ddd.player] : undefined,
    counter: typeof ddd.counter != 'undefined' ? [ddd.counter] : undefined,
    timer: typeof ddd.timer != 'undefined' ? [ddd.timer] : undefined,
  }
  return (
    <div className={masking.overlay} style={{gridArea: area, display: "grid", gridTemplateAreas: `"topL topR" "bottomL bottomR`}}>
      <GameViewInfo top={true} left={true} slotPath={simple ? [viewID] : [viewID, "SPLIT_"+area]} defaultData={defaultData}/>
      <GameViewInfo top={true} left={false} slotPath={simple ? [viewID] : [viewID, "SPLIT_"+area]} defaultData={defaultData}/>
      <GameViewInfo top={false} left={true} slotPath={simple ? [viewID] : [viewID, "SPLIT_"+area]} defaultData={defaultData}/>
      <GameViewInfo top={false} left={false} slotPath={simple ? [viewID] : [viewID, "SPLIT_"+area]} defaultData={defaultData}/>
    </div>
  )
}
type GameViewInfoProps = {
  top: boolean,
  left: boolean,
  slotPath: string[]
  defaultData?: Slot['data']
}

const GameViewInfo = ({
  top,
  left,
  slotPath,
  defaultData,
}:GameViewInfoProps) => {
  const area = (top ? "top" : "bottom") + (left ? "L" : "R")
  const [slotData, setSlotData] = useState<Slot["data"]>(undefined)
  const [registered, setRegistered] = useState(false)
  const slotContext = useContext(SlotContext)
  
  useEffect(() => {
    const slotID = [...slotPath, area].join("/")
    if (slotContext){
      if (!registered){
        slotContext.updateSlot({path: [...slotPath, area], for:{timer: true, player: true, counter: true}, data: defaultData})
        setRegistered(true)
      } else {
        setSlotData(slotID in slotContext.slots ? slotContext.slots[slotID].data : undefined)
      }
    }
  }, [slotContext, registered, slotPath, area, defaultData]);
  
  if (!slotData) return null
  const counterElem = slotData.counter ? slotData.counter.map((c, k) => {
    return <CounterDisplay key={k} index={c}/>
  }) : []
  const timerElem = slotData.timer ? slotData.timer.map((c, k) => {
    return <TimerDisplay.ByIndex key={k} index={c}/>
  }) : []
  const playerElem = slotData.player ? slotData.player.map((c, k) => {
    return <PersonDisplay.ByIndex key={k} index={c} role={"PLAYER"}/>
  }) : []
  const hasPlayerNames = playerElem.length > 0
  
  return (
    <div style={{gridArea: area, display: 'flex', flexDirection: top ? 'column' : 'column-reverse', alignItems: left ? 'flex-start': 'flex-end'}}>
      {hasPlayerNames ? <div style={{display: 'flex', flexDirection: left ? 'row' : 'row-reverse'}}>
        {playerElem}
        {counterElem}
      </div> : null}
      <div style={{display: 'flex', flexDirection: left ? 'row' : 'row-reverse'}}>
        {!hasPlayerNames ? counterElem : null}{timerElem}
      </div>
    </div>
  )
}
