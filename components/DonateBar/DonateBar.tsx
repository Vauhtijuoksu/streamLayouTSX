import {useStyle} from "@/themes/ThemeContext";
import {useDonatebarInfo, useDonationGoal, useDonations} from "@/DataHandler/DataProvider";
import {ReactNode, useEffect, useRef, useState} from "react";
import {TextSizeCheckComponent} from "@/util/TextSize";
import {Roller} from "@/components/Roller/Roller";
import {DonateBarIncentiveRoller, IncentiveRollerDisplay, useUpcomingIncentives} from "@/components/Display/Incentives";
import {DonateBarScheduleDisplay, useUpcomingGames} from "@/components/Display/Schedule";
import masking from "@/components/Holes/Masking.module.css"

type DonateBarProps = {
  scheduleStart?: number
}

export const DonateBar = ({
  scheduleStart = 1
}:DonateBarProps) => {
  const style = useStyle()
  const donations = useDonations()
  const incentives = useUpcomingIncentives()
  const upcomingGames = useUpcomingGames()
  const donatebarInfo = useDonatebarInfo()
  const donationGoal = useDonationGoal()
  const [start] = useState(Date.now())
  const [donationTotal, setDonationTotal] = useState<number|undefined>(undefined)
  const [rollTo, setRollTo] = useState<{timestamp: number, index: number, delayMultiplier: number}>({timestamp: 0, index: -1, delayMultiplier: 1})
  useEffect(() => {
    let total = 0
    donations.forEach((d) => {
      total += d.amount
    })
    setDonationTotal(Math.round(total))
  }, [donations]);
  useEffect(() => {
    if (Date.now() > start + 1000) setRollTo({timestamp: Date.now(), index: 0, delayMultiplier: 1.2})
  }, [donationTotal, start]);

  const rollElements:ReactNode[] = [<DonateeList key={'DonoList'}/>]
  if (donatebarInfo.length > 0 && donatebarInfo[0] != "") rollElements.push(
    <Roller key={'Info'} delaySeconds={10} rollElements={donatebarInfo.map((i, k) => <div key={k} className={style.donateBarInfo}>{i}</div>)}/>
  )
  if (upcomingGames.length >= scheduleStart) rollElements.push(
    <DonateBarScheduleDisplay start={scheduleStart}/>
  )
  if (incentives.length > 0) rollElements.push(
    <DonateBarIncentiveRoller rollDelay={10} key={"Incentives"} slides={5}/>
  )

  return (
      <div className={[masking.overlay, style.donateBar].join(" ")} style={{display: 'flex', flexDirection: 'row'}}>
        <div className={[style.donoLeft, style.donoCorner].join(" ")}>
          <DonationTotal total={donationTotal}/>
        </div>
        <div className={style.donateBarMain} style={{flex: 1, position: 'relative'}}>
          <DonationBarFiller total={donationTotal} goal={donationGoal}/>
          <div className={style.donoRoller} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
            <Roller delaySeconds={15} rollElements={rollElements} loopBack={1} rollTo={rollTo}/>
          </div>
        </div>
        <div className={[style.donoRight, style.donoCorner].join(" ")}>
          {donationGoal ? <div>{donationGoal}{"\xa0€"}</div> : null}
        </div>
      </div>
  )
}
type DonationTotalProps = {
  total: number | undefined
}
const DonationTotal = ({
  total
}:DonationTotalProps) => {
  const [displayTotal, setDisplayTotal] = useState<number>(-1)
  const [first, setFirst] = useState(true)
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)
  const style = useStyle()
  useEffect(() => {
    if (typeof total != 'undefined' && displayTotal != total) {
      if (first) {
        console.log("TOTAL: ", total, displayTotal)
        setDisplayTotal(total)
        if (total > 0) setFirst(false)
      } else if (displayTotal == -1){
        setDisplayTotal(total)
      } else {
        if (displayTotal < total - 0.999){
          timeout.current = setTimeout(() => setDisplayTotal(displayTotal + 1), 1500/Math.pow(total-displayTotal, 1.2))
        } else {
          setDisplayTotal(total)
        }
      }
    }
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [total, displayTotal, first]);


  if (displayTotal == -1) return null
  return (
    <TextSizeCheckComponent text={"1234567890"} varPreText={"number"}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'baseline'}}>
        {String(displayTotal).split("").map((s, i)=> <div key={i} className={style.donationNumber}>{s}</div>)} {"\xa0€"}
      </div>
    </TextSizeCheckComponent>
  )
}

type DonationBarFillerProps = {
  total?: number
  goal?: number,
}
const DonationBarFiller = ({
  total,
  goal
}:DonationBarFillerProps) => {
  const style = useStyle()

  if (typeof total == 'undefined' || !goal) return null
  return (
    <>
      <div className={style.donationBarFill2} style={{position: "absolute", zIndex:0, top: 0, left: -20, bottom: 0, right: ((1 - total/goal) * 100)+"%"}}></div>
      <div className={style.donationBarFill} style={{position: "absolute", zIndex:0, top: 0, left: -20, bottom: 0, right: ((1 - total/goal) * 100)+"%"}}></div>
    </>
  )
}

const DonateeList = () => {
  const style = useStyle()
  const donations = useDonations()
  return (
    <div className={style.donationList} style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center'}}>
      {donations.sort((a, b)=> {return b.timestamp - a.timestamp}).map((d, i) => {
        const old = Date.now() - d.timestamp > 30000
        return ([
            <div className={[style.donation, old ? style.old : ""].join(" ")} key={d.id}>{d.name} + {Math.round(d.amount * 10)/10} €</div>
            ,
            <div key={"b"+d.id} className={style.divider}/>
          ]
        )
      })}
    </div>
  )
}



