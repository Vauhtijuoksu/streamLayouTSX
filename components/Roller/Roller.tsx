import {ReactNode, useEffect, useRef, useState} from "react";
import rollerStyle from "./Roller.module.css";

type RollerProps = {
  rollTo?: {timestamp: number, index: number, delayMultiplier: number}
  rollElements: ReactNode[],
  showOverFlow?: boolean
  delaySeconds?: number
  sideWays?: boolean,
  fade?: boolean,
  loopBack?: number
}
export const Roller = ({
  rollTo = {timestamp: 0, index: -1, delayMultiplier: 1},
  rollElements,
  delaySeconds = 10,
  sideWays = false,
  fade = false,
  showOverFlow = false,
  loopBack = 0,
  }:RollerProps) => {
  const [index, setIndex] = useState(loopBack)
  const [nextIndex, setNextIndex] = useState(-1)
  const [rollDelayMultiplier, setRollDelayMultiplier] = useState(1)
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)
  useEffect(() => {
    if (rollTo.index >= 0){
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! IT CHANGED")
      console.log("rolling to: ", rollTo)
      setNextIndex(rollTo.index)
      setRollDelayMultiplier(rollTo.delayMultiplier)
    }
  }, [rollTo]);
  useEffect(() => {
    if (nextIndex != -1){
      setIndex(nextIndex)
      setNextIndex(-1)
    }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      if (index < rollElements.length -1) {
        setIndex(index+1)
      } else {
        setIndex(loopBack)
      }
      console.log("to", rollDelayMultiplier)
      setRollDelayMultiplier(1)
    }, delaySeconds*1000*rollDelayMultiplier)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [index, nextIndex, rollElements, delaySeconds, loopBack, rollDelayMultiplier]);

  return (
    <div className={[rollerStyle.roller, sideWays ? rollerStyle.sideways : "", fade ? rollerStyle.fade : ""].join(" ")} style={showOverFlow ? {} : {overflow: 'hidden'}}>
      {
        rollElements.map((e,i) => {
          return <div key={i} className={(i == index ? rollerStyle.rollerDisplay : rollerStyle.rollerHide)}>{e}</div>
        })
      }
    </div>
  )
}