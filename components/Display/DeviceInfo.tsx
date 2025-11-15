import {useCurrentGameData} from "@/DataHandler/DataProvider";
import {useStyle} from "@/themes/ThemeContext";
;

const deviceNames:{[key: string]: [string, string]} = {
  GBA: ["Game Boy Advance", "GBA"],
  PC: ["PC", "PC"],
  Switch: ["Nintendo Switch", "Switch"],
  PS1: ["Playstation", "PS\xa01"],
  PS2: ["Playstation\xa02", "PS\xa02"],
  PS3: ["Playstation\xa03", "PS\xa03"],
  PS4: ["Playstation\xa04", "PS\xa04"],
  PS5: ["Playstation\xa05", "PS\xa05"],
  NGC: ["GameCube", "GC"],
  SNES: ["Super Nintendo", "SNES"],
  Wii: ["Wii", "Wii"],
  NES: ["Nintendo", "NES"],
  MegaDrive: ["SEGA Mega Drive", "SMD"],
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
  if (typeof gameData == 'undefined') return null
  const devname = deviceNames[gameData.device] ?? ["",""]
  return (
    <div className={style.deviceInfo} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {hideName || hideYear ? null : useLongName ? <div className={style.deviceNameLong}>{devname[0]}</div> : <div className={style.deviceNameShort}>{devname[1]}</div>}
      <div className={style.deviceIcon}>
        <img style={{maxHeight: "100%", maxWidth: "100%"}} src={gameData.device} alt={''}/>
      </div>
      {!hideName && hideYear ? (useLongName ?  <div className={style.deviceNameLong}>{devname[0]}</div> : <div className={style.deviceNameShort}>{devname[1]}</div>) : !hideYear ? <div className={style.publishYear}>{gameData.published}</div> : null}
    </div>
  )
}
