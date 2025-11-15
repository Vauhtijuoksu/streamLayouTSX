"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {API, Counter, Games, People, Person, Timer, Donation, Incentives} from "@/DataHandler/api";


type dataProviderInterface = {
  games: Games
  people: People
  incentives: Incentives
  donationGoal?: number,
  donatebarInfo: string[],
  currentGame?: string,
  counter: Counter[],
  timer: Timer[],
  heartRate: number[],
  nowPlaying?: string,
  timeOffset: number,
  donations: Donation[],
  viewSettings: {
    defaultPlayerList: boolean,
    defaultBackseatList: boolean,
    defaultStudioList: boolean,
  }
}
const defaultValue:dataProviderInterface = {
  games: {},
  people: {},
  incentives: {},
  donationGoal: undefined,
  donatebarInfo: [],
  currentGame: undefined,
  counter: [],
  timer: [],
  heartRate: [],
  nowPlaying: undefined,
  timeOffset: 0,
  donations: [],
  viewSettings: {
    defaultPlayerList: true,
    defaultBackseatList: true,
    defaultStudioList: false,
  }
}
const DataContext = createContext<dataProviderInterface>(
  defaultValue
)


export const DataProvider = ({
  children,
}:{children:ReactNode}) => {
  const [games, setGames] = useState<dataProviderInterface['games']>(defaultValue.games)
  const [people, setPeople] = useState<dataProviderInterface['people']>(defaultValue.people)
  const [incentives, setIncentives] = useState<dataProviderInterface['incentives']>(defaultValue.incentives)
  const [donationGoal, setDonationGoal] = useState<dataProviderInterface['donationGoal']>(defaultValue.donationGoal)
  const [currentGame, setCurrentGame] = useState<dataProviderInterface['currentGame']>(defaultValue.currentGame)
  const [donatebarInfo, setDonatebarInfo] = useState<dataProviderInterface['donatebarInfo']>(defaultValue.donatebarInfo)
  const [counter, setCounter] = useState<dataProviderInterface['counter']>(defaultValue.counter)
  const [heartRate, setHeartRate] = useState<dataProviderInterface['heartRate']>(defaultValue.heartRate)
  const [timer, setTimer] = useState<dataProviderInterface['timer']>(defaultValue.timer)
  const [nowPlaying, setNowPlaying] = useState<dataProviderInterface['nowPlaying']>(defaultValue.nowPlaying)
  const [donations, setDonations] = useState<dataProviderInterface['donations']>(defaultValue.donations)
  const [timeOffset, setTimeOffset] = useState<dataProviderInterface['timeOffset']>(defaultValue.timeOffset)
  const [viewSettings, setViewSettings] = useState<dataProviderInterface['viewSettings']>(defaultValue.viewSettings)

  const pathname = usePathname().split("/")
  const isDock = (pathname.length > 0 && pathname[1] == "dock")

  const setValueState = (prefix: string, key:string) => {
    switch (key){
        case prefix+'games':
          readLocalStorage(prefix+'games', setGames)
        break
      case prefix+'people':
          readLocalStorage(prefix+'people', setPeople)
        break
      case prefix+'incentives':
          readLocalStorage(prefix+'incentives', setIncentives)
        break
      case prefix+'donationGoal':
          readLocalStorage(prefix+'donationGoal', setDonationGoal)
        break
      case prefix+'currentGame':
          readLocalStorage(prefix+'currentGame', setCurrentGame)
        break
      case prefix+'donatebarInfo':
          readLocalStorage(prefix+'donatebarInfo', setDonatebarInfo)
        break
      case prefix+'counter':
          readLocalStorage(prefix+'counter', setCounter)
        break
      case prefix+'heartRate':
          readLocalStorage(prefix+'heartRate', setHeartRate)
        break
      case prefix+'timer':
          readLocalStorage(prefix+'timer', setTimer)
        break
      case prefix+'nowPlaying':
          readLocalStorage(prefix+'nowPlaying', setNowPlaying)
        break
      case prefix+'timeOffset':
          readLocalStorage(prefix+'timeOffset', setTimeOffset)
        break
      case prefix+'donations':
          readLocalStorage(prefix+'donations', setDonations)
        break
      case prefix+'viewSettings':
          readLocalStorage(prefix+'viewSettings', setViewSettings)
        break
      }
  }


  useEffect(() => {
    const onStorageEvent = (ev:StorageEvent) => {
      const attribute = ev.key ? ev.key.split(":")[1] : undefined
      if (ev.key && attribute && Object.keys(defaultValue).includes(attribute)){
        setValueState(isDock ? 'API:' : 'USE:', ev.key)
      }
    }
    const pre = isDock ? 'API:' : 'USE:'
    Object.keys(defaultValue).forEach((k:string) => {
      console.log(pre+k)
      setValueState(pre, pre+k)
    })
    window.addEventListener('storage', onStorageEvent)
    return () => {
      window.removeEventListener('storage', onStorageEvent)
    }
  }, [isDock]);


  return (
    <DataContext.Provider value={{games, people, incentives, donatebarInfo, donationGoal, currentGame, counter, timer, heartRate, nowPlaying, timeOffset, donations, viewSettings}}>
      {children}
    </DataContext.Provider>
  )
}


const readLocalStorage = (param:string, setter:CallableFunction)=> {
  const field = localStorage.getItem(param);
  if (field && field != 'undefined') {
    const parsed = JSON.parse(field)
    if (parsed) setter(parsed)
  }
}
export const useGames = () => {
  const [s, setS] = useState<dataProviderInterface['games']>(defaultValue.games)
  const {games:v} = useContext(DataContext)
  useEffect(() => {
    console.log(v)
    setS(v)
  }, [v]);
  return s
}
export const usePeople = () => {
  const [s, setS] = useState<dataProviderInterface['people']>(defaultValue.people)
  const {people:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}
export const useIncentives = () => {
  const [s, setS] = useState<dataProviderInterface['incentives']>(defaultValue.incentives)
  const {incentives:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}


export const useCurrentGame = () => {
  const [s, setS] = useState<dataProviderInterface['currentGame']>(defaultValue.currentGame)
  const {currentGame:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}

type GameData = {
  id: string,
  index: number,
  game: string,
  startTime: number
  endTime: number,
  category: string,
  device: string,
  published: string,
  imgFileName: string,
  meta: string,
  player: Person[],
  backseat: Person[],
  studio: Person[]
}

export const useCurrentGameData = () => {
  const [s, setS] = useState<GameData|undefined>(undefined)
  const {currentGame, games, people} = useContext(DataContext)
  useEffect(() => {
    console.log("???? USE CURRENT GAMEDATA")
    console.log(currentGame)
    if (currentGame && games && people && currentGame in games){
      const {participants, ...game} = games[currentGame]
      setS({
        index: Object.keys(games).indexOf(currentGame),
        ...game,
        player: participants.filter((p) => {return (p.role == "PLAYER" && p.id in people)}).map((p) => {
          return people[p.id]
        }),
        backseat: participants.filter((p) => {return (p.role == "BACKSEAT" && p.id in people)}).map((p) => {
          return people[p.id]
        }),
        studio: participants.filter((p) => {return (p.role == "STUDIO" && p.id in people)}).map((p) => {
          return people[p.id]
        }),
      })
    }
  }, [currentGame, games, people]);
  return s
}

export const useDonatebarInfo = () => {
  const [s, setS] = useState<dataProviderInterface['donatebarInfo']>(defaultValue.donatebarInfo)
  const {donatebarInfo:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}

export const useDonationGoal = () => {
  const [s, setS] = useState<dataProviderInterface['donationGoal']>(defaultValue.donationGoal)
  const {donationGoal:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}
export const useCounter = () => {
  const [s, setS] = useState<dataProviderInterface['counter']>(defaultValue.counter)
  const {counter:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}
export const useHeartRate = () => {
  const [s, setS] = useState<dataProviderInterface['heartRate']>(defaultValue.heartRate)
  const {heartRate:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}
export const useTimer = () => {
  const [s, setS] = useState<dataProviderInterface['timer']>(defaultValue.timer)
  const {timer:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}
export const useNowPlaying = () => {
  const [s, setS] = useState<dataProviderInterface['nowPlaying']>(defaultValue.nowPlaying)
  const {nowPlaying:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}
export const useDonations = () => {
  const [s, setS] = useState<dataProviderInterface['donations']>(defaultValue.donations)
  const {donations:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}

export const useTimeOffset = () => {
  const [s, setS] = useState<dataProviderInterface['timeOffset']>(defaultValue.timeOffset)
  const {timeOffset:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}

export const useViewSettings = () => {
  const [s, setS] = useState<dataProviderInterface['viewSettings']>(defaultValue.viewSettings)
  const {viewSettings:v} = useContext(DataContext)
  useEffect(() => {
    setS(v)
  }, [v]);
  return s
}
