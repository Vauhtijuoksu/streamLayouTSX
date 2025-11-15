
import {ReactNode, useEffect, useState} from "react";
import {useCurrentGameData, useGames, usePeople} from "@/DataHandler/DataProvider";
import {Game} from "@/DataHandler/api";
import {useStyle} from "@/themes/ThemeContext";
import {GameIcon} from "@/components/Display/GameInfo";

type ScheduleDisplayProps = {
  count?: number,
  start?: number,
  fallBack?: ReactNode
}

export const useUpcomingGames = () => {
  const currentGameData = useCurrentGameData()
  const games = useGames()
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([])
  useEffect(() => {
    if (currentGameData){
      const gameList = Object.values(games)
      setUpcomingGames(gameList.slice(currentGameData.index))
    }
  }, [currentGameData, games]);
  return upcomingGames
}

export const ScheduleDisplay = ({
  count = 3,
  fallBack = null,
}:ScheduleDisplayProps) => {
  const upcomingGames = useUpcomingGames()
  const style = useStyle()

  if (upcomingGames.length == 0) return fallBack
  return (
    <div className={style.schedule}>
      {upcomingGames.slice(0, Math.min(count, upcomingGames.length)).map((g) => {
        return(
          <ScheduleRow key={g.id} {...g}/>
        )
      })}
    </div>
  )
}

const ScheduleRow = ({...game}:Game) => {
  const style = useStyle()
  const startTime = new Date(game.startTime)
  const hours = String(startTime.getHours()).padStart(2, ' ').split('')
  const minutes = String(startTime.getMinutes()).padStart(2, '0').split('')
  const people = usePeople()
  const players = game.participants.filter((p) => p.role == 'PLAYER').map((p) => people[p.id]?.displayName)
  return (
    <div className={[style.row, style.scheduleRow].join(" ")}>
      <div className={[style.row, style.scheduleTime].join(" ")} style={{width: '2.6em', alignItems: 'center'}}>
        {hours.map((h, i) => <div key={"h"+i} style={{width: '25%', textAlign: 'center'}}>{h}</div>)}
        <div>
          :
        </div>
        {minutes.map((m, i) => <div key={"m"+i} style={{width: '25%', textAlign: 'center'}}>{m}</div>)}
      </div>
      <div className={style.scheduleIcon}>
        <GameIcon.icon icon={game.imgFileName}/>
      </div>
      <div className={style.column}>
        <div className={style.scheduleGame}>
          {game.game}
        </div>
        <div className={style.row}>
          <div className={style.scheduleCategory}>
            {game.category}
          </div>
          <div className={style.schedulePlayers}>
            {players.join(", ")}
          </div>
        </div>
      </div>
    </div>
  )
}



export const DonateBarScheduleDisplay = ({
  count = 6,
  start = 1,
  fallBack = null,
}:ScheduleDisplayProps) => {
  const upcomingGames = useUpcomingGames()
  const style = useStyle()

  if (upcomingGames.length <= start) return fallBack
  return (
    <div className={style.donateBarContent}>
      {upcomingGames.slice(start, Math.min(count, upcomingGames.length)).map((g, i) => {
        return(
          [
           i != 0 ? <div key={"d"+i} className={style.divider}/> : null,
           <DonateBarScheduleGame key={g.id} {...g}/>
          ]
        )
      })}
    </div>
  )
}


const DonateBarScheduleGame = ({...game}:Game) => {
  const style = useStyle()
  const startTime = new Date(game.startTime)
  const hours = String(startTime.getHours()).padStart(2, ' ').split('')
  const minutes = String(startTime.getMinutes()).padStart(2, '0').split('')
  const people = usePeople()
  const players = game.participants.filter((p) => p.role == 'PLAYER').map((p) => people[p.id]?.displayName)
  return (
    <div className={style.donateBarSingle}>
      <div className={[style.row, style.donateBarEdge].join(" ")} style={{alignItems: 'center', justifyContent: 'left'}}>
        {hours.map((h, i) => <div key={"h"+i}>{h}</div>)}
        <div>
          :
        </div>
        {minutes.map((m, i) => <div key={"m"+i}>{m}</div>)}
      </div>
      <div className={style.donateBarMain}>
        {game.game} <div className={style.smallDivider}/> {game.category} <div className={style.smallDivider}/> {players.join(", ")}
      </div>
      <div className={style.donateBarEdge}></div>
    </div>
  )
}