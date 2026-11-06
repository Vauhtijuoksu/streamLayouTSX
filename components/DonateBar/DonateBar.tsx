import {useConfig, useStyle, useTheme} from "@/themes/ThemeContext";
import {useCharities, useCharityTotals, useDonatebarInfo, useDonationGoal, useDonations, usePeople} from "@/DataHandler/DataProvider";
import {isValidElement, ReactNode, useEffect, useRef, useState} from "react";
import {TextSizeCheckComponent} from "@/util/TextSize";
import {Donation} from "@/DataHandler/api";
import {Roller} from "@/components/Roller/Roller";
import {DonateBarIncentiveRoller, IncentiveRollerDisplay, useUpcomingIncentives} from "@/components/Display/Incentives";
import {DonateBarScheduleDisplay, useUpcomingGames} from "@/components/Display/Schedule";
import masking from "@/components/Holes/Masking.module.css"
import {TimerDisplay} from "@/components/Display/Timer";

const ROLLER_LOOP_BACK = 1

type DonateBarProps = {
  scheduleStart?: number
  noText?: boolean
}

export const DonateBar = ({
  scheduleStart = 1,
  noText = false
}:DonateBarProps) => {
  const style = useStyle()
  const donations = useDonations()

  const {bottomBarContent: bbc} = useConfig()
  const incentives = useUpcomingIncentives()
  const upcomingGames = useUpcomingGames()
  const donatebarInfo = useDonatebarInfo()
  const donationGoal = useDonationGoal()
  const charities = useCharities()
  const [rollIndex, setRollIndex] = useState(ROLLER_LOOP_BACK)
  const [start] = useState(Date.now())
  const [donationTotal, setDonationTotal] = useState<number|undefined>(undefined)
  const [rollTo, setRollTo] = useState<{timestamp: number, index: number, delayMultiplier: number}>({timestamp: 0, index: -1, delayMultiplier: 1})
  const [highlight, setHighlight] = useState<CharityHighlight>({})
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const seenDonationIds = useRef<Set<string>>(new Set())
  useEffect(() => {
    let total = 0
    donations.forEach((d) => {
      total += d.amount
    })
    setDonationTotal(Math.round(total))
  }, [donations]);
  const slides:ReactNode[] = []
  if (donatebarInfo.length > 0 && donatebarInfo[0] != "") slides.push(
    <Roller key={'Info'} delaySeconds={10} rollElements={donatebarInfo.map((i, k) => <div key={k} className={style.donateBarInfo}>{i}</div>)}/>
  )
  if (upcomingGames.length >= scheduleStart) slides.push(
    <DonateBarScheduleDisplay start={scheduleStart}/>
  )
  if (incentives.length > 0) slides.push(
    <DonateBarIncentiveRoller rollDelay={10} key={"Incentives"} slides={5}/>
  )

  const hasCharities = Object.keys(charities).length > 0
  const rollElements:ReactNode[] = [<DonateeList key={'DonoList'}/>]
  if (hasCharities && slides.length == 0) rollElements.push(<CharitySlide key={'Charities'} highlight={highlight}/>)
  slides.forEach((s, i) => {
    if (hasCharities) rollElements.push(<CharitySlide key={'Charities' + i} highlight={highlight}/>)
    rollElements.push(s)
  })
  const current = rollElements[rollIndex]
  const charitySlideShown = isValidElement(current) && current.type === CharitySlide

  useEffect(() => {
    const fresh = donations.filter((d) => !seenDonationIds.current.has(d.id))
    seenDonationIds.current = new Set(donations.map((d) => d.id))
    if (fresh.length == 0 || Date.now() <= start + 1000) return
    const withCharity = fresh.filter((d) => d.charity && charities[d.charity])
    if (withCharity.length > 0) {
      const h:CharityHighlight = {}
      withCharity.sort((a, b) => a.timestamp - b.timestamp).forEach((d) => h[d.charity!] = d)
      const target = charitySlideShown ? rollIndex : ROLLER_LOOP_BACK
      setHighlight(h)
      setHighlightIndex(target)
      setRollTo({timestamp: Date.now(), index: target, delayMultiplier: 1.2})
    } else {
      setRollTo({timestamp: Date.now(), index: 0, delayMultiplier: 1.2})
    }
  }, [donations, charities, start, charitySlideShown, rollIndex]);
  useEffect(() => {
    if (rollIndex != highlightIndex) setHighlight({})
  }, [rollIndex]);

  return (
      <div className={[masking.overlay, style.donateBar].join(" ")} style={{display: 'flex', flexDirection: 'row'}}>
        <div className={[style.donoLeft, style.donoCorner].join(" ")}>
          {noText ? null : <DonationTotal total={donationTotal}/> }
        </div>
        <div className={style.donateBarMain} style={{flex: 1, position: 'relative'}}>
          {noText ? null :
            <div style={{opacity: charitySlideShown ? 0 : 1, transition: 'opacity 1s'}}>
              <DonationBarFiller total={donationTotal} goal={donationGoal}/>
            </div>
          }
          {noText || !hasCharities ? null :
            <div style={{opacity: charitySlideShown ? 1 : 0, transition: 'opacity 1s'}}>
              <CharityBarFiller/>
            </div>
          }
          {noText ? null :
            <div className={style.donoRoller} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
              <Roller delaySeconds={5} rollElements={rollElements} loopBack={ROLLER_LOOP_BACK} rollTo={rollTo} onChange={setRollIndex}/>
            </div>
          }
        </div>
        <div className={[style.donoRight, style.donoCorner].join(" ")}>
          {bbc?.right == "total" ?
            (donationGoal && !noText ? <div>{donationGoal}{"\xa0€"}</div> : null)
            :
            (bbc?.right == "time" ?
              (!noText ? <CurrentTime/> : null)
            :
            null)
          }
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
      <div className={style.donationBarFill2} style={{position: "absolute", zIndex:0, top: 0, left: -30, bottom: 0, right: ((1 - total/goal) * 100)+"%"}}></div>
      <div className={style.donationBarFill} style={{position: "absolute", zIndex:0, top: 0, left: -30, bottom: 0, right: ((1 - total/goal) * 100)+"%"}}></div>
    </>
  )
}

const CharityBarFiller = () => {
  const style = useStyle()
  const charities = useCharities()
  const totals = useCharityTotals()

  return (
    <div style={{position: "absolute", zIndex: 0, top: 0, left: 0, bottom: 0, right: 0, display: 'flex', flexDirection: 'row'}}>
      {Object.values(charities).map((c, i) => {
        const filled = c.goal ? Math.min(1, Math.round(totals[c.id] ?? 0) / c.goal) : 0
        const right = ((1 - filled) * 100) + "%"
        const left = i == 0 ? -30 : 0
        const n = i % 5 + 1
        return (
          <div key={c.id} className={style.charitySegment}>
            <div className={style.donationBarFill2} style={{position: "absolute", top: 0, left, bottom: 0, right, background: `var(--charityFillLoad${n}, var(--donateBarFillLoad))`}}></div>
            <div className={style.donationBarFill} style={{position: "absolute", top: 0, left, bottom: 0, right, background: `var(--charityFill${n}, var(--donateBarFill))`}}></div>
          </div>
        )
      })}
    </div>
  )
}

type CharityHighlight = {[charityId: string]: Donation}
const CharitySlide = ({highlight}:{highlight: CharityHighlight}) => {
  const style = useStyle()
  const charities = useCharities()
  const totals = useCharityTotals()

  return (
    <div className={style.charitySlide}>
      {Object.values(charities).map((c) => {
        const total = Math.round(totals[c.id] ?? 0)
        const d = highlight[c.id]
        return (
          <div key={c.id} className={style.charityLabel}>
            <div className={style.charityImgPlaceholder}>{c.name.charAt(0)}</div>
            {d ?
              <div className={[style.charityName, style.charityHighlight].join(" ")}>{d.name} +{Math.round(d.amount * 10)/10}{"\xa0€"}</div>
              :
              <div className={style.charityName}>{c.name.split(" - ")[0]}</div>
            }
            <div className={style.charityAmount}>{total}{c.goal ? " / " + c.goal : ""}{"\xa0€"}</div>
          </div>
        )
      })}
    </div>
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


const CurrentTime = () => {
  const [time, setTime] = useState(new Date)
  const style = useStyle()

  const timeout = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (timeout.current) clearInterval(timeout.current)
    timeout.current = setInterval(() => {
      setTime(new Date)
    }, 1000)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  },[])
  const hours = String(time.getHours()).padStart(2, ' ').split('')
  const minutes = String(time.getMinutes()).padStart(2, '0').split('')
  return (
    <div>
      <div className={[style.row, style.scheduleTime].join(" ")} style={{width: '2.6em', height:"100%", alignItems: 'center'}}>
        {hours.map((h, i) => <div key={"h"+i} style={{width: '25%', textAlign: 'center'}}>{h}</div>)}
        <div>
          :
        </div>
        {minutes.map((m, i) => <div key={"m"+i} style={{width: '25%', textAlign: 'center'}}>{m}</div>)}
      </div>
    </div>
  )
}