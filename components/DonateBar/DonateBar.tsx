import {useConfig, useStyle, useTheme} from "@/themes/ThemeContext";
import {useCharities, useCharityTotals, useDonatebarInfo, useDonationGoal, useDonations, usePeople, useTimeOffset} from "@/DataHandler/DataProvider";
import {ReactNode, useEffect, useRef, useState} from "react";
import {TextSizeCheckComponent} from "@/util/TextSize";
import {Donation} from "@/DataHandler/api";
import {Roller} from "@/components/Roller/Roller";
import {DonateBarIncentiveRoller, IncentiveRollerDisplay, useUpcomingIncentives} from "@/components/Display/Incentives";
import {DonateBarScheduleDisplay, useUpcomingGames} from "@/components/Display/Schedule";
import masking from "@/components/Holes/Masking.module.css"
import {TimerDisplay} from "@/components/Display/Timer";

const GROW_MS = 1000
const SHOW_MS = 6000
const ANIMATE_MAX_AGE_MS = 2 * 60 * 1000
const PART_MIN = '1em'
const EXPANDED = '22em'
const LABELED_MIN = '9em'
const UNDER_CORNER = '30px'
type ShownDonation = {donation: Donation, open: boolean}

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
  const timeOffset = useTimeOffset()
  const [start] = useState(Date.now())
  const [donationTotal, setDonationTotal] = useState<number|undefined>(undefined)
  const [rollTo, setRollTo] = useState<{timestamp: number, index: number, delayMultiplier: number}>({timestamp: 0, index: -1, delayMultiplier: 1})
  const seenDonationIds = useRef<Set<string>>(new Set())
  const [queue, setQueue] = useState<Donation[]>([])
  const [shown, setShown] = useState<ShownDonation | undefined>(undefined)
  const [rollIndex, setRollIndex] = useState(1)
  useEffect(() => {
    let total = 0
    donations.forEach((d) => {
      total += d.amount
    })
    setDonationTotal(Math.round(total))
  }, [donations]);
  useEffect(() => {
    const fresh = donations.filter((d) => !seenDonationIds.current.has(d.id))
    seenDonationIds.current = new Set(donations.map((d) => d.id))
    if (fresh.length == 0 || Date.now() <= start + 1000) return
    const withCharity = fresh.filter((d) => d.charity && charities[d.charity])
    const serverNow = Date.now() - timeOffset
    const recent = withCharity.filter((d) => serverNow - d.timestamp < ANIMATE_MAX_AGE_MS)
    if (recent.length > 0) setQueue((q) => [...q, ...recent.sort((a, b) => a.timestamp - b.timestamp)])
    if (withCharity.length < fresh.length) setRollTo({timestamp: Date.now(), index: 0, delayMultiplier: 1.2})
  }, [donations, charities, start, timeOffset]);
  useEffect(() => {
    if (shown || queue.length == 0) return
    setShown({donation: queue[0], open: true})
    setQueue(queue.slice(1))
  }, [shown, queue]);
  useEffect(() => {
    if (!shown) return
    const t = setTimeout(
      () => setShown(shown.open ? {...shown, open: false} : undefined),
      shown.open ? GROW_MS + SHOW_MS : GROW_MS
    )
    return () => clearTimeout(t)
  }, [shown]);

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
  const hasCharities = Object.keys(charities).length > 0
  let charitySlideIndex = -1
  if (hasCharities) {
    charitySlideIndex = rollElements.length
    rollElements.push(<div key={"Charities"}/>)
  }

  return (
      <div className={[masking.overlay, style.donateBar].join(" ")} style={{display: 'flex', flexDirection: 'row'}}>
        <div className={[style.donoLeft, style.donoCorner].join(" ")}>
          {noText ? null : <DonationTotal total={donationTotal}/> }
        </div>
        <div className={style.donateBarMain} style={{flex: 1, position: 'relative'}}>
          {noText ? null : (hasCharities ?
            <CharityFill total={donationTotal} goal={donationGoal} shown={shown} labeled={rollIndex == charitySlideIndex}/>
            :
            <DonationBarFiller total={donationTotal} goal={donationGoal}/>
          )}
          {noText ? null :
            <div className={style.donoRoller} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: shown ? 0 : 1, transition: 'opacity 0.5s'}}>
              <Roller delaySeconds={15} rollElements={rollElements} loopBack={1} rollTo={rollTo} onChange={setRollIndex}/>
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

type CharityFillProps = {
  total?: number
  goal?: number
  shown?: ShownDonation
  labeled?: boolean
}
const CharityFill = ({
  total,
  goal,
  shown,
  labeled = false,
}:CharityFillProps) => {
  const style = useStyle()
  const charities = Object.values(useCharities())
  const totals = useCharityTotals()

  if (typeof total == 'undefined' || !goal) return null
  const open = shown?.open ?? false
  const showLabels = labeled && !shown
  const realWidth = showLabels ? "100%" : Math.min(1, total / goal) * 100 + "%"
  const moneySum = charities.reduce((sum, c) => sum + (totals[c.id] ?? 0), 0)
  const minWidth = open
    ? `(${EXPANDED} + ${charities.length - 1} * ${PART_MIN})`
    : `(${charities.length} * ${showLabels ? LABELED_MIN : PART_MIN})`
  return (
    <div className={style.charityFill} style={{
      left: `-${UNDER_CORNER}`,
      width: `calc(max(${realWidth}, ${minWidth}) + ${UNDER_CORNER})`,
      transition: `width ${GROW_MS}ms ease-in-out`,
    }}>
      {charities.map((c, i) => {
        const isShown = shown?.donation.charity == c.id
        const grows = open && isShown
        const grow = open ? (grows ? 1 : 0)
          : showLabels ? 1 / charities.length
          : moneySum > 0 ? (totals[c.id] ?? 0) / moneySum : 0
        const basis = grows ? EXPANDED : (showLabels ? LABELED_MIN : PART_MIN)
        const extra = i == 0 ? ` + ${UNDER_CORNER}` : ""
        return (
          <div key={c.id} className={style.charityPart} style={{
            flex: `${grow} 0 calc(${basis}${extra})`,
            paddingLeft: i == 0 ? UNDER_CORNER : 0,
            background: `var(--charityFill${i % 5 + 1}, var(--donateBarFill))`,
            transition: `flex ${GROW_MS}ms ease-in-out`,
          }}>
            <div className={style.charityLabel} style={{
              left: i == 0 ? UNDER_CORNER : 0,
              opacity: showLabels ? 1 : 0,
              transition: showLabels ? 'opacity 0.5s 1s' : 'opacity 0.3s',
            }}>
              <div className={style.charityImgPlaceholder}>{c.name.charAt(0)}</div>
              <div className={style.charityPartText}>{c.name.split(" - ")[0]}</div>
            </div>
            {isShown && shown ?
              <div className={style.charityPartText} style={{opacity: grows ? 1 : 0, paddingLeft: '0.4em'}}>
                {c.name.split(" - ")[0]} – {shown.donation.name} +{Math.round(shown.donation.amount * 10)/10}{"\xa0€"}
              </div>
              : null}
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