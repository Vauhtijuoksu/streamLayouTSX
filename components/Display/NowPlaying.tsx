import {useNowPlaying} from "@/DataHandler/DataProvider";
import {Fit2Box} from "@/util/TextSize";
import {useStyle} from "@/themes/ThemeContext";


export const NowPlaying = () => {
  const style = useStyle()
  const np = useNowPlaying()
  if (!np) return null
  return (
    <div className={style.nowPlaying}>
      <div className={style.nowPlayingContent}>
        <Fit2Box>{np}</Fit2Box>
      </div>
    </div>
  )

}