import {useEffect, useState} from "react";

import {useCurrentGameData, useViewSettings} from "@/DataHandler/DataProvider";
import {Role} from "@/schema/constant";
import {Person} from "@/DataHandler/api";
import {PersonDisplay} from "@/components/Display/Person";
import {useConfig, useStyle} from "@/themes/ThemeContext";
import {SinglePluralHeader} from "@/themes/types";



interface PersonListProps {
  isNotDefault?: boolean
  role: Role
  header?: SinglePluralHeader | null
}
const usePersonList = (role:Role, isNotDefault:boolean) => {
  const viewSettings = useViewSettings()
  const gameData = useCurrentGameData()
  const [personList, setPersonList] = useState<Person[]>([])
  useEffect(() => {
    if (gameData){
      switch (role) {
        case "BACKSEAT":
          if (isNotDefault || viewSettings.defaultBackseatList) setPersonList(gameData.backseat)
          break
        case "PLAYER":
          if (isNotDefault || viewSettings.defaultPlayerList) setPersonList(gameData.player)
          break
        case "STUDIO":
          if (isNotDefault || viewSettings.defaultStudioList) setPersonList(gameData.studio)
          break
      }
    }
  }, [viewSettings, gameData, role, isNotDefault]);
  return personList
}

export const PersonList = ({
  isNotDefault = false,
  role,
  header: headerInput,
}:PersonListProps) => {
  const Personlist = usePersonList(role, isNotDefault)
  const config = useConfig()
  const style = useStyle()
  if (Personlist.length == 0) return null
  const header:SinglePluralHeader = typeof headerInput === null ? null : typeof headerInput == 'undefined' && role && config?.header && role in config.header ? config.header[role] : headerInput
  return (
    <>
      {header ? (typeof header == 'object' && header && "s" in header && "p" in header ? Personlist.length == 1 ? <div className={style.roleHeader}>{header.s}</div> : <div className={style.roleHeader}>{header.p}</div> : <div className={style.roleHeader}>{header}</div>) : null}
      <div className={style.personList} style={{display: "flex", flexDirection: "row", flexWrap: 'wrap'}}>
        {
          Personlist.map((p, k) => {
            return [...(k != 0 ? [<>&nbsp;&&nbsp;</>] : []), <PersonDisplay key={k} name={p.displayName} role={role}/>]
          })
        }
      </div>
    </>
  )
}


interface PersonListPropsHalf extends PersonListProps {
  half: 1 | 2
}
export const PersonListHalf = ({
  isNotDefault = false,
  role,
  header: headerInput,
  half,
}:PersonListPropsHalf) => {
  const Personlist = usePersonList(role, isNotDefault)
  const config = useConfig()
  const style = useStyle()
  const listLenght = Personlist.length
  const list = half == 1 ? Personlist.slice(0, Math.ceil(listLenght/2)) : Personlist.slice(Math.ceil(listLenght/2), listLenght)
  if (list.length == 0) return null
  const header:SinglePluralHeader = typeof headerInput === null ? null : typeof headerInput == 'undefined' && role && config?.header && role in config.header ? config.header[role] : headerInput
  return (
    <>
      {header ? (typeof header == 'object' && header && "s" in header && "p" in header ? list.length == 1 ? <div className={style.roleHeader}>{header.s}</div> : <div className={style.roleHeader}>{header.p}</div> : <div className={style.roleHeader}>{header}</div>) : null}
      <div className={style.personList} style={{display: "flex", flexDirection: "row", flexWrap: 'wrap'}}>
        {
          list.map((p, k) => {
            return [...(k != 0 ? [<>&nbsp;&&nbsp;</>] : []), <PersonDisplay key={k} name={p.displayName} role={role}/>]
          })
        }
      </div>
    </>
  )
}