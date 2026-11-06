"use client"
import {LayoutComponentProps} from "@/layouts/list";
import {GameView} from "@/components/GameView";
import {DynamicHole} from "@/components/Holes/Hole";
import {PersonList, usePersonList} from "@/components/PersonList";
import masking from "@/components/Holes/Masking.module.css";
import {useConfig, useStyle, useTheme} from "@/themes/ThemeContext";
import {CSSProperties, useEffect, useState} from "react";
import {DonateBar} from "@/components/DonateBar/DonateBar";
import {Estimate, MainTimer} from "@/components/Display/Timer";
import {GameIcon, GameInfo} from "@/components/Display/GameInfo";
import {DeviceInfo} from "@/components/Display/DeviceInfo";
import {SponsorDisplay} from "@/components/Display/Sponsors";
import {ScheduleDisplay} from "@/components/Display/Schedule";
import {IncentiveRollerDisplay} from "@/components/Display/Incentives";
import {Logo} from "@/components/Display/Logo";
import {NowPlaying} from "@/components/Display/NowPlaying";
import {Layout} from "@/layouts/types";
import {aspectRatios} from "@/schema/constant";
import {Fit2Box} from "@/util/TextSize";
import {useCurrentGameData} from "@/DataHandler/DataProvider";

export const pregameOverlay:Layout = {
  displayName: 'Pre Game Overlay',
  cameras: 0,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  const ended = useGifEnded()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.pregame, style.pregameOverlay, ended ? style.ended : ""].join(" ")}>
        <div style={{gridArea: 'top', height: '100%', gap: '1em'}}>
        </div>
        <div style={{gridArea: 'left'}}>
        </div>
        <div style={{gridArea: 'right'}}>
          <div className={style.iconHolder}>
            <GameIcon animated></GameIcon>
          </div>
        </div>
      </div>
      <div className={[style.donateBar, style.hidden].join(" ")} style={{display: 'flex', flexDirection: 'row'}}></div>
    </div>
  );
}


const useGifEnded = () => {
  const gameData = useCurrentGameData()
  const [duration, setDuration] = useState<number | undefined>(undefined)

  const conf = useConfig()
  const {theme} = useTheme()
  const path = conf.charImgFolder ?? theme ?? 'generic'
  const [ended, setEnded] = useState(false)
  useEffect(() => {
    if (gameData?.imgFileName){
      const url = "/char/"+path+"/anim/" + gameData.imgFileName.split(".")[0] + ".gif"
      fetch(url).then((res) => {
        if (res.ok) {
          res.arrayBuffer().then(ab => isGifAnimated(new Uint8Array(ab))).then(d => setDuration(d + 1.5))
        } else {
          setDuration(0.1)
        }
      })
    }
  },[gameData, gameData?.imgFileName])
  useEffect(() => {
    let to = null
    if (duration){
      to = setTimeout(() => {setEnded(true)}, (duration) *1000)
    }
    return () => {
      if (to){
        clearTimeout(to)
      }
    }
  }, [duration])
  return ended
}

function isGifAnimated (uint8:Uint8Array) {
    let duration = 0
    for (let i = 0, len = uint8.length; i < len; i++) {
      if (uint8[i] == 0x21
        && uint8[i + 1] == 0xF9
        && uint8[i + 2] == 0x04
        && uint8[i + 7] == 0x00)
      {
        const delay = (uint8[i + 5] << 8) | (uint8[i + 4] & 0xFF)
        duration += delay < 2 ? 10 : delay
      }
    }
    return duration / 100.0
  }