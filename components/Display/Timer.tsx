import {useCurrentGameData, useTimeOffset, useTimer} from "@/DataHandler/DataProvider";
import {Timer} from "@/DataHandler/api"
import {useEffect, useRef, useState} from "react";
import {useStyle} from "@/themes/ThemeContext";
import {TextSizeCheckComponent} from "@/util/TextSize";

interface TimerDisplayProps extends Timer {
  separator?: string,
  decimals?: 0 | 1 | 2
  className?: string
}

enum TimerState {
  ZERO,
  RUNNING,
  STOPPED,
}

const splitTimeSegment = (n:number):DisplayTimeUnit => {
  const s = String(Math.floor(n)).split('')
  if (s.length == 0) return [0, 0]
  if (s.length == 1) return [0, Number(s[0])]
  return [Number(s[0]), Number(s[1])]
}
const getHours = (n: number) => {
  return String(Math.floor(n/(1000*60*60))).split('').map((s) => Number(s))
}

const getDisplayTime = (start:number, end:number):DisplayTime => {
  const duration = new Date(end - start)
  return {
    hour: getHours(duration.getTime()),
    minute: splitTimeSegment(duration.getUTCMinutes()),
    second: splitTimeSegment(duration.getUTCSeconds()),
    hundredths: splitTimeSegment(duration.getUTCMilliseconds()/10)
  }
}

type DisplayTimeUnit = [number, number]
type DisplayTime = {
  hour: number[],
  minute: DisplayTimeUnit,
  second: DisplayTimeUnit,
  hundredths: DisplayTimeUnit,
}
const DisplayTimeZero:DisplayTime = {
  hour: [0],
  minute: [0, 0],
  second: [0, 0],
  hundredths: [0, 0],
}

export const TimerDisplay = ({
  start,
  end,
  separator = ":",
  decimals = 1,
  className
}:TimerDisplayProps) => {
  const [state, setState] = useState<TimerState>(TimerState.ZERO)
  const [time, setTime] = useState<DisplayTime>(DisplayTimeZero)
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)
  const timeOffset = useTimeOffset()
  const style = useStyle()
  useEffect(() => {
    if (start == null) {
      setTime(DisplayTimeZero)
      setState(TimerState.ZERO)
    } else if (end == null) {
      timeout.current = setInterval(() => {
        const now = Date.now() - timeOffset
        setTime(getDisplayTime(start, now))
      }, decimals == 0 ? 500 : decimals == 1 ? 50 : 5)
      setState(TimerState.RUNNING)
    } else {
      setTime(getDisplayTime(start, end))
      setState(TimerState.STOPPED)
    }
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [start, end, timeOffset, decimals]);

  const timeSegment = (segment:number[], k:string) => {
    return segment.map((s, i)=> <div className={[style.timeNumber, style["time"+k]].join(" ")} key={k+i}>{s}</div>)
  }
  const stateClassName = {
    [TimerState.ZERO]: style.timerIdle,
    [TimerState.RUNNING]: style.timerRunning,
    [TimerState.STOPPED]: style.timerStopped
  }[state]
  return (
    <TextSizeCheckComponent className={[style.timer, stateClassName, className].join(" ")} text={"1234567890"} varPreText={"number"}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'baseline'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>{timeSegment(time.hour, "H")}</div>
        <div className={style.timeSeparator}>{separator}</div>
        {timeSegment(time.minute, "M")}
        <div className={style.timeSeparator}>{separator}</div>
        {timeSegment(time.second, "S")}
        { decimals == 0 ? null :
          <>
            <div className={style.timeSeparator}>.</div>
            { decimals == 1 ?
              timeSegment([time.hundredths[0]], "F")
              :
              timeSegment(time.hundredths, "F")
            }
          </>
        }
      </div>
    </TextSizeCheckComponent>
  )
}


type TimerDisplayByIndexProps = {
  index: number
}

TimerDisplay.ByIndex = function ByIndex({
  index,
}:TimerDisplayByIndexProps){
  const timers = useTimer()
  if (timers.length <= index) return null
  if (timers[index].end === null) return null
  return <TimerDisplay {...timers[index]}/>
}


TimerDisplay.Total = function Total({className}:{className?:string}){
  const timers = useTimer()
  const [timer, setTimer] = useState<Timer>({start: null, end: null})
  const style = useStyle()
  useEffect(() => {
    const updatedTimer:Timer = {
      start: null,
      end: null
    }
    timers.forEach((t) => {
      if (t.start !== null){
        if (updatedTimer.start == null || updatedTimer.start > t.start) updatedTimer.start = t.start
        if (updatedTimer.end == null || (t.end !== null && updatedTimer.end < t.end)) updatedTimer.end = t.end
      }
    })
    setTimer(updatedTimer)
  }, [timers]);

  return <TimerDisplay {...timer} className={[style.TotalTimer, className].join(" ")}/>
}

export const MainTimer = () => {
  const gameData = useCurrentGameData()
  const [estimate, setEstimate] = useState<DisplayTime | undefined>(undefined)
  const style = useStyle()
  useEffect(() => {
    if (gameData) setEstimate(getDisplayTime(gameData.startTime, gameData.endTime))
  }, [gameData]);
  return (
    <div className={style.mainTimer} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <div className={style.clockIcon}/>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
        <TimerDisplay.Total/>
        {typeof estimate == 'undefined' ? null :
          <div className={style.estimate} style={{display: 'flex', flexDirection: 'row', width: "100%"}}>
            <div style={{flexGrow: 3, textAlign: 'right'}}>Arvio:</div>
            <div style={{flexGrow: 1, textAlign: 'right'}}>{estimate.hour.length > 0 ? <>{estimate.hour}h </> : null}{estimate.minute[0] > 0 ? estimate.minute : estimate.minute[1]}min</div>
          </div>
        }
      </div>
    </div>
  )
}