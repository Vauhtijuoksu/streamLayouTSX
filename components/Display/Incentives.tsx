
import {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";
import {useCurrentGameData, useGames, useIncentives, usePeople} from "@/DataHandler/DataProvider";
import {Game, IncentiveMilestone, IncentiveOpen, IncentiveOption, IncentiveStatusOption} from "@/DataHandler/api";
import {useStyle} from "@/themes/ThemeContext";
import {GameIcon} from "@/components/Display/GameInfo";
import {Fit2Box} from "@/util/TextSize";
import {Roller} from "@/components/Roller/Roller";

type IncentiveDisplayProps = {
  slides?: number,
  onSlide?: number
  fallBack?: ReactNode
  rollDelay?: number
}
export const useUpcomingIncentives = () => {
  const incentives = useIncentives()
  const [upcomingIncentives, setUpcomingIncentives] = useState<(IncentiveOpen | IncentiveOption | IncentiveMilestone)[]>([])
  const [reCheckIncentives, setReCheckIncentives] = useState<number>(0)
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)
  useEffect(() => {
    setUpcomingIncentives(Object.values(incentives).filter((i) => i.endTime >= Date.now()).sort((a, b) => a.endTime - b.endTime))
    timeout.current = setTimeout(() => setReCheckIncentives(Date.now()), 1000 * 60)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [incentives, reCheckIncentives])
  return upcomingIncentives
}

export const IncentiveRollerDisplay = ({
  slides = 6,
  onSlide = 2,
  fallBack = null,
  rollDelay = 15
}:IncentiveDisplayProps) => {
  const style = useStyle()
  const incentives = useUpcomingIncentives()
  const [incentiveElements, setIncentiveElements] = useState<ReactNode[]>([])
  useEffect(() => {
    const elem:ReactNode[] = incentives.slice(0, Math.min(incentives.length, slides*onSlide)).map((i) => <IncentiveDisplay key={i.id} {...i}/>)
    const elemGrouped:ReactNode[] = []
    for (let g = 0; g < slides; g++) {
      const group:ReactNode[] = []
      for (let i = 0; i < onSlide; i++) {
        if (elem.length > g*onSlide+i) group.push(elem[g*onSlide+i])
      }
      elemGrouped.push(<div style={{display:'flex', flexDirection: 'column', justifyContent:'space-around', height: '100%', width: '90%'}}>{group}</div>)
    }
    setIncentiveElements(elemGrouped)
  }, [incentives, slides, onSlide]);
  if (incentiveElements.length == 0) return fallBack
  return (
    <>
      <div style={{fontSize: '1.2em'}}>
        Tulevia kannustimia:
      </div>
      <div className={style.incentives} style={{flexGrow: 1}}>
        <Roller showOverFlow={true}  sideWays fade delaySeconds={rollDelay} rollElements={incentiveElements}/>
      </div>
    </>
  )
}

const IncentiveDisplay = ({...incentive}:(IncentiveOpen|IncentiveOption|IncentiveMilestone)) => {
  const style = useStyle()
  const games = useGames()
  const incentiveStatus = () => {
    if (incentive.type == 'open') return <IncentiveDisplay.open  {...incentive}/>
    if (incentive.type == 'option') return <IncentiveDisplay.option {...incentive}/>
    if (incentive.type == 'milestone') return <IncentiveDisplay.milestone {...incentive}/>
  }
  const end = new Date(incentive.endTime)
  return (
    <div className={style.incentive}>
      {games[incentive.gameID] ? <div className={style.incentiveGameTitle}>
        {games[incentive.gameID].game}
      </div> : null}
      <div className={style.incentiveTitle}>
        {incentive.title}
      </div>
      <div className={style.incentiveStatus}>
        {incentiveStatus()}
      </div>
      <div className={style.incentiveClosing}>
        Kannustin sulkeutuu: {`${end.getDate()}.${end.getMonth()+1}. klo ${end.getHours()}:${String(end.getMinutes()).padStart(2, "0")}`}
      </div>
    </div>
  )
}
IncentiveDisplay.open = function OpenIncentiveDisplay({...incentive}:IncentiveOpen){
  const style = useStyle()
  if (incentive.status.length == 0) return <div className={style.emptyIncentive}>{"Kukkaan ei oo vielä ehottanu mittää!"}</div>
  const sorted = incentive.status.sort((a, b) => b.amount - a.amount)
  const best = sorted.slice(0, Math.min(5, incentive.status.length)).map((i, index) => {return index})
  return (
    <IncentiveDisplay.optionOrOpen max={sorted[0].amount} min={sorted[sorted.length-1].amount} list={incentive.status} best={best}/>
  )
}
IncentiveDisplay.option = function OptionIncentiveDisplay({...incentive}:IncentiveOption ){
  const sorted = incentive.status.sort((a, b) => b.amount - a.amount)
  const best = sorted.slice(0, Math.min(5, incentive.status.length)).map((i, index) => {return index})
  return (
    <IncentiveDisplay.optionOrOpen max={sorted[0].amount} min={sorted[sorted.length-1].amount} list={incentive.status} best={best}/>
  )
}

IncentiveDisplay.optionOrOpen = function OptionOrOpenIncentiveDisplay({max, min, best, list}:{max: number, min:number, best: number[], list:IncentiveStatusOption[]}){
  const style = useStyle()
  return (
    <div className={[style.row, style.incentiveOptionRow].join(" ")}>
      {list.filter((i, index) => index in best).map((i, k) => (
        <div key={i.option} className={[style.incentiveBar, i.amount == max && max != 0 ? style.winningOption : "", i.amount == 0 ? style.emptyOption : ""].join(' ')} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems:'center', '--fillAmount': max > 0 ? (max-min == 0 ? 1 : (i.amount - min)/(max - min)) : 0} as CSSProperties}>
          <div className={style.incentiveOptionName}>
            {i.option}
          </div>
          <div className={style.incentiveBarFill}>
            <div className={style.incentiveBarAmount}>
              {Math.round(i.amount * 10)/10} €
            </div>
          </div>
        </div>
      ))}
      {best.length < list.length ? <div style={{alignSelf: 'flex-end', fontSize: '2em', marginBottom: '-0.2em', width: 0}}>...</div> : null}
    </div>
  )
}
IncentiveDisplay.milestone = function MilestoneIncentiveDisplay({...incentive}:IncentiveMilestone) {
  const style = useStyle()
  const fill = incentive.status.length > 0 ? Math.min(1, incentive.amount / incentive.status[0].milestoneGoal) : 0
  return (
    <div className={[style.incentiveMilestoneRow, fill == 1 ? style.winningOption : "", fill == 0 ? style.emptyOption : ""].join(' ')} style={{position: 'relative'}}>
      <div className={style.incentiveBarFill} style={{right: (1-fill)*100+"%"}}>

      </div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, padding: "0 1em"}}>
        <div>
          {Math.round(incentive.amount * 10)/10} €
        </div>
        <div>
          {incentive.status[0].milestoneGoal} €
        </div>
      </div>
    </div>
  )
}

type DonateBarIncentiveRollerProps = {
  rollDelay: number
  slides: number
}

export const DonateBarIncentiveRoller = ({
  slides = 6,
  rollDelay = 10
}:DonateBarIncentiveRollerProps) => {
  const incentives = useUpcomingIncentives()
  const [incentiveElements, setIncentiveElements] = useState<ReactNode[]>([])
  useEffect(() => {
    const elem:ReactNode[] = incentives.slice(0, Math.min(incentives.length, slides)).map((i) => <DonateBarIncentiveDisplay key={i.id} {...i}/>)
    setIncentiveElements(elem)
  }, [incentives, slides]);
  if (incentiveElements.length == 0) return null
  return (
    <Roller delaySeconds={rollDelay} rollElements={incentiveElements}/>
  )
}



const DonateBarIncentiveDisplay = ({...incentive}:(IncentiveOpen|IncentiveOption|IncentiveMilestone)) => {
  const style = useStyle()
  const games = useGames()
  const incentiveStatus = () => {
    if (incentive.type == 'open') return <DonateBarIncentiveDisplay.open  {...incentive}/>
    if (incentive.type == 'option') return <DonateBarIncentiveDisplay.option {...incentive}/>
    if (incentive.type == 'milestone') return <DonateBarIncentiveDisplay.milestone {...incentive}/>
  }

  return (
    <div className={style.donateBarContent}>
      <div className={style.donateBarSingle}>
        <div className={style.donateBarEdge}>
          {games[incentive.gameID] ? games[incentive.gameID].game : null}
        </div>
        <div className={style.donateBarMain}>
          {incentive.title} {incentiveStatus()}
        </div>
        <div className={style.donateBarEdge}>
        </div>
      </div>
    </div>
  )
}
DonateBarIncentiveDisplay.open = function DonateBarOpenIncentiveDisplay({...incentive}:IncentiveOpen){
  const style = useStyle()
  if (incentive.status.length == 0) return [<div key={"d0"} className={style.smallDivider}/>, <div key={"ie"+incentive.gameID} className={style.emptyIncentive}>{"Ehdota jotain!"}</div>]
  const sorted = incentive.status.sort((a, b) => b.amount - a.amount)
  return (
    <DonateBarIncentiveDisplay.optionOrOpen list={sorted}/>
  )
}
DonateBarIncentiveDisplay.option = function DonateBarOptionIncentiveDisplay({...incentive}:IncentiveOption){
  const sorted = incentive.status.sort((a, b) => b.amount - a.amount)
  return (
    <DonateBarIncentiveDisplay.optionOrOpen list={sorted}/>
  )
}

DonateBarIncentiveDisplay.optionOrOpen = function DonateBarOptionOrOpenIncentiveDisplayListed({list}:{list:IncentiveStatusOption[]}){
  const style = useStyle()
  return list.map((i, k) => {
    return ([
      <div key={"b"+k} className={style.smallDivider}/>
      ,
      <div key={k}>
        {i.option} {Math.round(i.amount * 10)/10} €
      </div>
      ])
  })
}
DonateBarIncentiveDisplay.milestone = function DonateBarMilestoneIncentiveDisplay({list=false, ...incentive}:IncentiveMilestone & {list?: boolean}) {
  const style = useStyle()
  return ([
      <div key={"d0"} className={style.smallDivider}/>,
      <div key={'i0'}>
        {Math.round(incentive.amount * 10)/10} € / {incentive.status[0].milestoneGoal} €
      </div>
    ]
  )
}
