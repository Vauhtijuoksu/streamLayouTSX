import {useNowPlaying} from "@/DataHandler/DataProvider";
import {Fit2Box} from "@/util/TextSize";
import {useStyle} from "@/themes/ThemeContext";


export const NowPlaying = () => {
  const style = useStyle()
  const np = useNowPlaying()
  if (!np) return null
  return (
    <Fit2Box className={style.nowPlaying}>{np}</Fit2Box>
  )

}