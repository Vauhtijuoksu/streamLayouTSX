import {useTimer} from "@/DataHandler/DataProvider";
import {TimerDisplay, useTotalTimer} from "@/components/Display/Timer";
import masking from "@/components/Holes/Masking.module.css"


type RaceTimerProps = {
  id: string
  corner: 'TL' | 'TR' | 'BL' | 'BR'
  padding?: string
  others?: string[]
}

export const TempRaceTimerDisplay = ({
  id,
  corner,
  padding = '10px',
  others = []
}:RaceTimerProps)=> {
  const timers = useTimer()
  const timer = timers.find((t) => t.id == id)
  const totalTimer = useTotalTimer()
  if (typeof timer == 'undefined' || timer.start == null) return null

  const diffStart = (totalTimer.start == null || Math.abs(timer.start - totalTimer.start) > 500)
  const diffEnd = timer.end != null ? (totalTimer.end == null || Math.abs(timer.end - totalTimer.end) > 500) : totalTimer.end != null


  let ohtersDiffEnd = false
  let othersDiffStart = false
  timers.filter((t) => others.includes(t.id)).forEach((t) => {
    const diffMinorEnd = timer.end != null ? (t.end == null || Math.abs(timer.end - t.end) > 100) : t.end != null
    const diffMinorStart = timer.start != null && t.start != null && Math.abs(timer.start - t.start) > 100
    if (diffMinorEnd){
      ohtersDiffEnd = true
    }
    if (diffMinorStart){
      othersDiffStart = true
    }
  })
  const show = (othersDiffStart && timer.end == null && diffStart) || (ohtersDiffEnd && timer.end != null)
  if (!show) return null
  return (
    <div className={masking.overlay} style={{position: 'absolute', fontSize: "2em", top: padding, right: padding, bottom: padding, left: padding, display: 'flex', flexDirection: 'column', justifyContent: corner == 'BL' || corner == 'BR' ? 'flex-end' : 'flex-start', alignItems: corner == 'BL' || corner == 'TL' ? 'flex-start' : 'flex-end'}}>
      <TimerDisplay start={timer.start} end={timer.end} id={id}/>
    </div>
  )
}
