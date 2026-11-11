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
import OBSWebSocket from "obs-websocket-js";

export const pregameOverlay:Layout = {
  displayName: 'Pre Game Overlay',
  cameras: 0,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  const gameData = useCurrentGameData()
  const sceneLive = useObsSceneLive()
  const replayKey = gameData ? gameData.id + "-" + sceneLive : undefined
  const ended = useGifEnded(replayKey, gameData?.imgFileName)
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.pregame, style.pregameOverlay, ended ? style.ended : ""].join(" ")}>
        <div style={{gridArea: 'top', height: '100%', gap: '1em'}}>
        </div>
        <div style={{gridArea: 'left'}}>
        </div>
        <div style={{gridArea: 'right'}}>
          <div className={style.iconHolder}>
            <GameIcon animated replay={replayKey}></GameIcon>
          </div>
        </div>
      </div>
      <div className={[style.donateBar, style.hidden].join(" ")} style={{display: 'flex', flexDirection: 'row'}}></div>
    </div>
  );
}

const useObsSceneLive = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const scenes = params.get('obsScene')?.split(',').map((s) => s.trim())
    if (!scenes) return
    const obs = new OBSWebSocket()
    let stopped = false
    let retry: ReturnType<typeof setTimeout> | undefined
    const connect = () => {
      obs.connect(params.get('obsUrl') ?? 'ws://localhost:4455', params.get('obsPassword') ?? process.env.NEXT_PUBLIC_OBS_PASSWORD)
        .then(() => { if (stopped) obs.disconnect() })
        .catch((e) => console.warn("OBS websocket:", e.message))
    }
    obs.on('ConnectionClosed', () => {
      clearTimeout(retry)
      if (!stopped) retry = setTimeout(connect, 5000)
    })
    obs.on('CurrentProgramSceneChanged', ({sceneName}) => {
      if (scenes.includes(sceneName)) setCount((c) => c + 1)
    })
    connect()
    return () => {
      stopped = true
      clearTimeout(retry)
      obs.disconnect()
    }
  }, [])
  return count
}

const useGifEnded = (replayKey?: string, imgFileName?: string) => {
  const conf = useConfig()
  const {theme} = useTheme()
  const path = conf.charImgFolder ?? theme ?? 'generic'
  const [ended, setEnded] = useState(false)
  useEffect(() => {
    if (!replayKey || !imgFileName) return
    setEnded(false)
    let cancelled = false
    let to: ReturnType<typeof setTimeout> | undefined
    const url = "/char/" + path + "/anim/" + imgFileName.split(".")[0] + ".gif?g=" + replayKey
    fetch(url)
      .then((res) => res.ok ? res.arrayBuffer().then(ab => isGifAnimated(new Uint8Array(ab)) + 1.5) : 0.1)
      .then((duration) => {
        if (!cancelled) to = setTimeout(() => setEnded(true), duration * 1000)
      })
    return () => {
      cancelled = true
      if (to) clearTimeout(to)
    }
  }, [replayKey, imgFileName, path])
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