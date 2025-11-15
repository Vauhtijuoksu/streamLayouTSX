import {useCurrentGameData} from "@/DataHandler/DataProvider";
import {Role} from "@/schema/constant";
import {useStyle} from "@/themes/ThemeContext";

type PersonDisplayProps = {
  name: string,
  role?: Role,
}

const useRoleClassName = (role?:Role) => {
  const style = useStyle()
  if (!style) return ""
  if (!role) return style.roleUnknown
  switch (role){
    case "PLAYER":
      return style.rolePlayer
    case "BACKSEAT":
      return style.roleBackseat
    case "STUDIO":
      return style.roleStudio
  }
}

export const PersonDisplay = ({
  name,
  role,
}:PersonDisplayProps) => {
  const roleClass = useRoleClassName(role)
  return  <span className={roleClass}>{name}</span>
}


type PersonDisplayByIndexProps = {
  index: number
  role: Role
}



PersonDisplay.ByIndex = function ByIndex({
  index,
  role,
}:PersonDisplayByIndexProps){
  const gamedata = useCurrentGameData()
  if (!gamedata) return null
  const getPeople = () => {
    switch (role) {
      case "PLAYER":
        return gamedata.player
      case "BACKSEAT":
        return gamedata.backseat
      case "STUDIO":
        return gamedata.studio
    }
  }
  const people = getPeople()
  if (people.length <= index) return null
  return <PersonDisplay name={people[index].displayName} role={role}/>
}