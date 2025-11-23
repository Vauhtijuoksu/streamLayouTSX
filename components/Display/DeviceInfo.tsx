import {useCurrentGameData} from "@/DataHandler/DataProvider";
import {useConfig, useStyle, useTheme} from "@/themes/ThemeContext";
;

const deviceNames:{[key: string]: [string, string]} = {
  GBA: ["Game\xa0Boy\xa0Advance", "GBA"],
  GBC: ["Game\xa0Boy\xa0Color", "GBC"],
  GB: ["Game\xa0Boy", "GB"],
  PC: ["PC", "PC"],
  Switch: ["Nintendo\xa0Switch", "Switch"],
  Puzzle: ["Lautapeli", ""],
  Retro: ["Joku\xa0Retro", ""],
  N64: ["Nintendo\xa064", "N64"],
  PSP: ["Playstation\xa0Portable", "PSP"],
  PSVita: ["Playstation\xa0Vita", "PSVita"],
  PS1: ["Playstation", "PS1"],
  PS2: ["Playstation\xa02", "PS2"],
  PS3: ["Playstation\xa03", "PS3"],
  PS4: ["Playstation\xa04", "PS4"],
  PS5: ["Playstation\xa05", "PS5"],
  GCN: ["GameCube", "GC"],
  NGC: ["GameCube", "GC"],
  DS: ["Nintendo\xa0DS", "DS"],
  Wii: ["Nintendo\xa0Wii", "Wii"],
  WiiU: ["Nintendo\xa0Wii\xa0U", "Wii\xa0U"],
  XBOX: ["Xbox", "Xbox"],
  XBOX360: ["Xbox\xa0360", "Xbox360"],
  NES: ["Nintendo", "NES"],
  SNES: ["Super\xa0Nintendo", "SNES"],
  MasterSystem: ["SEGA\xa0Master\xa0System", "SMS"],
  MegaDrive: ["SEGA\xa0Mega\xa0Drive", "SMD"],
  Genesis: ["SEGA\xa0Genesis", "Genesis"],
  other: ["", ""]
}


type DeviceInfoProps = {
  hideName?: boolean
  hideYear?: boolean
  useLongName?: boolean
}
export const DeviceInfo = ({
  hideName = false,
  hideYear = false,
  useLongName = false,
}:DeviceInfoProps) => {
  const gameData = useCurrentGameData()
  const style = useStyle()
  const conf = useConfig()
  const {theme} = useTheme()
  const path = conf.deviceImgFolder ?? theme ?? 'generic'
  if (typeof gameData == 'undefined') return null
  const devname = deviceNames[gameData.device] ?? ["",""]
  return (
    <div className={style.deviceInfo} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {hideName || hideYear ? null : useLongName ? <div className={style.deviceNameLong}>{devname[0]}</div> : <div className={style.deviceNameShort}>{devname[1]}</div>}
      <div className={style.deviceIcon}>
        <img style={{maxHeight: "100%", maxWidth: "100%"}} src={"/device/"+path+"/"+gameData.device + ".png"} alt={''}/>
      </div>
      {!hideName && hideYear ? (useLongName ?  <div className={style.deviceNameLong}>{devname[0]}</div> : <div className={style.deviceNameShort}>{devname[1]}</div>) : !hideYear ? <div className={style.publishYear}>{gameData.published}</div> : null}
    </div>
  )
}
