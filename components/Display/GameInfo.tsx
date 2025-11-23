import {useCurrentGameData} from "@/DataHandler/DataProvider";
import {useConfig, useStyle, useTheme} from "@/themes/ThemeContext";
import {Fit2Box} from "@/util/TextSize";

type GameInfoProps = {
  hideIcon?: boolean
}
export const GameInfo = ({
  hideIcon = false,
}:GameInfoProps) => {
  const gameData = useCurrentGameData()
  const style = useStyle()

  if (typeof gameData == 'undefined') return null
  return (
    <div className={style.gameInfo} style={{display: 'flex', flexDirection: 'row'}}>
      {hideIcon ? null : <GameIcon.icon icon={gameData.imgFileName}/>}
      <div className={style.gameData} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
        <Fit2Box className={style.gameName}>
          {gameData.game}
        </Fit2Box>
        <Fit2Box className={style.category}>
          {gameData.category}
        </Fit2Box>
      </div>
    </div>
  )
}


export const GameIcon = () => {
  const gameData = useCurrentGameData()
  if (typeof gameData == 'undefined') return null
  return <GameIcon.icon icon={gameData.imgFileName}/>
}

GameIcon.icon = function WithData({icon, className}:{icon:string, className?:string}) {
  const style = useStyle()
  const conf = useConfig()
  const {theme} = useTheme()
  const path = conf.charImgFolder ?? theme ?? 'generic'
  return (
    <div className={[style.gameIcon, className].join(" ")}>
      <img style={{maxHeight: "100%", maxWidth: "100%"}} src={"/char/"+path+"/"+icon} alt={''}/>
    </div>
  )
}