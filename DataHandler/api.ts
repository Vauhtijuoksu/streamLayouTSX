import {roundAmount} from "@/util/numbers";

type IncentiveType = 'open' | 'milestone' | 'option'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API {
  export type GameParticipant = {
    participant_id: string,
    role: string
  }
  export type Participant = {
    id: string,
    display_name: string,
    twitch_channel: string,
    discord_nick: string
  }
  export type Game = {
    id: string,
    game: string,
    start_time: string
    end_time: string,
    category: string,
    device: string,
    players: string[]
    published: string,
    img_filename: string,
    meta: string
    participants: GameParticipant[]
  }
  type IncentiveStatus ={
    type: 'option' | 'milestone',
    option: string,
    amount: number
    milestone_goal?: number,
    status?: string
  }
  export type Incentive = {
    id: string,
    game_id: string,
    end_time: string
    title: string
    type: IncentiveType,
    info: string,
    option_parameters?: string[]
    open_char_limit?: number,
    total_amount: number,
    status: IncentiveStatus[]
  }
  export type StreamMetadata = {
    donation_goal: null | number,
    current_game_id: string,
    donatebar_info: string[],
    counters: {value: number, style: number}[],
    heart_rates: number[],
    timers: {
      id: string,
      name: string,
      start_time:string | null,
      end_time:string | null
    }[],
    now_playing:null | string,
    server_time:string
  }
  export type Donation = {
    id: string,
    timestamp: string,
    name: string,
    amount: number,
  }

}

export const fetchFromApi = async <T,>(APIURL:string, endpoint:string):Promise<T | undefined> => {
  try {
    const response = await fetch(`${APIURL}/${endpoint}`);
    if (!response.ok) {
      console.error(`Response status: ${response.status}`);
      return undefined
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return undefined
  }
}

export const fetchStreamMetadata = async (APIURL: string) => {
  return await fetchFromApi<API.StreamMetadata>(APIURL, "stream-metadata")
}


export type People = {[key:string]: Person}
export type Person = {
  id: string,
  displayName: string,
  twitchChannel: string,
}
type Participant = {
  id: string,
  role: string
}
export type Games = {[key: string]: Game}
export type Game = {
  id: string,
  game: string,
  startTime: number
  endTime: number,
  category: string,
  device: string,
  published: string,
  imgFileName: string,
  meta: string,
  participants: Participant[]
}
export type IncentiveStatusOption = {
  type: 'option',
  option: string,
  amount: number
}
type IncentiveStatusMilestone = {
  type: 'milestone',
  milestoneGoal: number,
  status: string
}
export type Incentives = {[key: string]: IncentiveOpen | IncentiveOption | IncentiveMilestone}
type IncentiveBase = {
  id: string,
  gameID: string,
  endTime: number,
  title: string
  amount: number,
}
export type IncentiveOpen = IncentiveBase & {
  type: 'open',
  status: IncentiveStatusOption[]
}
export type IncentiveOption = IncentiveBase & {
  type: 'option',
  status: IncentiveStatusOption[]
}
export type IncentiveMilestone = IncentiveBase & {
  type: 'milestone',
  status: IncentiveStatusMilestone[]
}

export interface Timer {
  start: number | null
  end: number | null
}
export interface Counter {
  value: number,
  style: number
}
type MetaData = {
  donationGoal?: number,
  currentGame?: string,
  donatebarInfo: string[],
  counter: Counter[],
  heartRate: number[],
  timer: Timer[],
  nowPlaying?: string,
}
export type Donation = {
  id: string,
  timestamp: number,
  name: string,
  amount: number,
}

export class ApiClient {
  APIURL: string
  games: Games = {}
  people: People = {}
  incentives: Incentives = {}
  donations: Donation[] = []
  metadata: MetaData | undefined = undefined
  standAlone: boolean = false
  timeOffset: number = 0
  constructor(APIURL:string, standAlone=false) {
    this.APIURL = APIURL
    this.standAlone = standAlone
    if (standAlone) this.setTimeOffset()
  }
  private async get<T>(path:string):Promise<T | undefined> {
    try {
      const response = await fetch(this.APIURL  + path)
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
  public async getPeople():Promise<People> {
    return this.get<API.Participant[]>('players').then(data => {
      if (data){
        const people:People = {}
        data.forEach((p) => {
          people[p.id] = {
            id: p.id,
            displayName: p.display_name,
            twitchChannel: p.twitch_channel
          }
        })
        const update = this.checkObjectDifference(people, this.people)
        this.people = people
        if (update) this.triggerUpdate('people')
        return people
      }
      return this.people
    })
  }
  public async getGames():Promise<Games> {
    return this.get<API.Game[]>('gamedata').then(data => {
      if (data){
        const games:Games = {}
        data.forEach((g) => {
          games[g.id] = {
            id: g.id,
            game: g.game,
            startTime: Date.parse(g.start_time),
            endTime: Date.parse(g.end_time),
            category: g.category,
            device: g.device,
            published: g.published,
            imgFileName: g.img_filename,
            meta: g.meta,
            participants: g.participants.map(p => {
              return {
                id: p.participant_id,
                role: p.role
              }
            })
          }

        })
        const update = this.checkObjectDifference(games, this.games)
        this.games = games
        if (update) this.triggerUpdate('games')
        return games
      }
      return this.games
    })
  }
  public async getIncentives():Promise<Incentives> {
    return this.get<API.Incentive[]>('incentives').then(data => {
      if (data){
        const incentives:Incentives = {}
        data.forEach((i) => {
          incentives[i.id] = {
            id: i.id,
            gameID: i.game_id,
            endTime: Date.parse(i.end_time),
            title: i.title,
            amount: roundAmount(i.total_amount),
            ...(i.type != 'milestone' ? {
                type: i.type,
                status: i.status.map((s) => {
                  return {
                    type: 'option',
                    option: s.option ?? 'error',
                    amount: roundAmount(s.amount) ?? 0,
                  }
                })
              } : {
              type: i.type,
              status: i.status.map((s) => {
                return {
                  type: 'milestone',
                  milestoneGoal: s.milestone_goal ?? 0,
                  status: s.status ?? 'ERROR'
                }
              })
            })
          }

        })
        const update = this.checkObjectDifference(incentives, this.incentives)
        this.incentives = incentives
        if (update) this.triggerUpdate('incentives')
        return incentives
      }
      return this.incentives
    })
  }
  public async initData() {
    this.getMetadata()
  }
  public async setTimeOffset() {
    const fetchStart = Date.now()
    const iterations = 5
    this.timeOffset = 0
    for (let t = 0; t < iterations; t++){
      const offset = await this.get<API.StreamMetadata>('stream-metadata').then((data):number | undefined => {
        if (data) {
          const fetchTime = (Date.now() - fetchStart)/2
          const severTime = (new Date(data.server_time)).getTime()
          return ((fetchStart + fetchTime) - severTime)
        }
      })
      if (offset) {
        this.timeOffset += offset / iterations
      } else if (t > 0) {
        this.timeOffset += this.timeOffset/t
      }
    }
    this.triggerUpdate('timeOffset')
  }
  public async getMetadata():Promise<MetaData|undefined> {
    return await this.get<API.StreamMetadata>('stream-metadata').then((data):MetaData|undefined => {
      if (data) {
        const metadata = {
          donationGoal: data.donation_goal || undefined,
          currentGame: data.current_game_id,
          donatebarInfo: data.donatebar_info,
          counter: data.counters,
          heartRate: data.heart_rates,
          timer: data.timers.map((t) => {
            return {
              start: t.start_time ? Date.parse(t.start_time) : null,
              end: t.end_time ? Date.parse(t.end_time) : null,
            }
          }),
          nowPlaying: data.now_playing || undefined,
        }
        const updates = this.checkUpdates(metadata, this.metadata)
        this.metadata = metadata
        this.triggerUpdates(updates)
        return metadata
      }
      return this.metadata
    })
  }
  public async getDonations():Promise<Donation[]|undefined> {
    return await this.get<API.Donation[]>('donations').then((data):Donation[]|undefined => {
      if (data) {
        const donations:Donation[] = data.map((d) => {
          return {
            id: d.id,
            timestamp: Date.parse(d.timestamp),
            name: d.name,
            amount: roundAmount(d.amount),
          }
        })
        const update = this.checkObjectDifference(donations, this.donations)
        this.donations = donations
        if (update) this.triggerUpdate('donations')
        return donations
      }
      return this.donations
    })
  }
  checkUpdates(NEW:object, OLD?:object) {
    if (!NEW) return []
    if (!OLD) {
      return Object.keys(NEW)
    } else {
      return Object.keys(NEW).filter((u) => {
        const un = NEW[u as keyof typeof NEW]
        const uo = OLD[u as keyof typeof OLD]
        if (typeof un != typeof uo) return true
        if (typeof un == 'object') {
          if (this.checkObjectDifference(un, uo)) return true
        } else if (Array.isArray(un) && Array.isArray(uo)){
          if (this.checkArrayDifference(un, uo)) return true
        } else {
          if (un !== uo) return true
        }
      })
    }
  }
  checkArrayDifference(a:unknown[], b:unknown[], keys=false) {
    if (a.length != b.length) return true
    for (let i = 0; i < a.length; i++){
      if (!keys) {
        if (typeof a[i] != typeof b[i]) return true
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
          if (this.checkArrayDifference(a[i] as unknown[], b[i] as unknown[])) return true
        } else if (typeof a[i] == 'object'){
          if (this.checkObjectDifference(a[i] as object, b[i] as object)) return true
        } else {
          if (a[i] != b[i]) return true
        }
      } else {
        if (!b.includes(a[i]) || !a.includes(b[i])) return true
      }
    }
    return false
  }
  checkObjectDifference<T extends object>(a:T, b:T) {
    const ak = Object.keys(a)
    const bk = Object.keys(b)
    if (this.checkArrayDifference(ak, bk, true)) return true
    for (let i = 0; i < ak.length; i++){
      const aa = a[ak[i] as keyof typeof a]
      const bb = b[ak[i] as keyof typeof b]
      if (typeof aa != typeof bb) return true
      if (aa && bb){
        if (Array.isArray(aa) && Array.isArray(bb)){
          if (this.checkArrayDifference(aa, bb)) return true
        } else if (typeof aa == 'object' && typeof bb == 'object') {
          if (this.checkObjectDifference(aa, bb)) return true
        } else {
          if (aa != bb) return true
        }
      } else if (aa !== bb) return true
    }
    return false
  }
  triggerUpdates(updates:string[]) {
    updates.forEach((u) => this.triggerUpdate(u))
  }
  triggerUpdate(update:string) {
    switch (update){
      case 'games':
        this.updateLocalStorage(update, this.games)
        break
      case 'people':
        this.updateLocalStorage(update, this.people)
        break
      case 'incentives':
        this.updateLocalStorage(update, this.incentives)
        break
      case 'donationGoal':
        this.updateLocalStorage(update, this.metadata?.donationGoal)
        break
      case 'currentGame':
        this.getGames()
        this.getPeople()
        this.updateLocalStorage(update, this.metadata?.currentGame)
        break
      case 'donatebarInfo':
        this.updateLocalStorage(update, this.metadata?.donatebarInfo)
        break
      case 'counter':
        this.updateLocalStorage(update, this.metadata?.counter)
        break
      case 'heartRate':
        this.updateLocalStorage(update, this.metadata?.heartRate)
        break
      case 'timer':
        this.updateLocalStorage(update, this.metadata?.timer)
        break
      case 'nowPlaying':
        this.updateLocalStorage(update, this.metadata?.nowPlaying)
        break
      case 'timeOffset':
        this.updateLocalStorage(update, this.timeOffset)
        break
      case 'donations':
        this.updateLocalStorage(update, this.donations)
        this.getIncentives()
        break
      default:
        console.log("Unhandled update trigger '" + update + "'!")
    }
  }
  updateLocalStorage(update:string, value:unknown){
    localStorage.setItem("API:"+update, JSON.stringify(value))
    if (this.standAlone) {
      console.log("triggering", update)
      localStorage.setItem("USE:"+update, JSON.stringify(value))
      window.dispatchEvent(new StorageEvent('storage', {key: "USE:" + update}))
    }
  }
}