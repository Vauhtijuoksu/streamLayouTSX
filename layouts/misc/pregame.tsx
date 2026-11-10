"use client"
import {LayoutComponentProps} from "@/layouts/list";
import {GameView} from "@/components/GameView";
import {DynamicHole} from "@/components/Holes/Hole";
import {PersonList, usePersonList} from "@/components/PersonList";
import masking from "@/components/Holes/Masking.module.css";
import {useConfig, useStyle} from "@/themes/ThemeContext";
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

export const pregame:Layout = {
  displayName: 'Pre Game',
  cameras: 1,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  const [upd, setUpd] = useState(0)
  const personList = usePersonList("PLAYER", false)
  useEffect(() => {
    setUpd(Date.now)
  }, [personList, personList.length])
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.pregame].join(" ")}>
        <div className={[style.mainArea, style.column].join(" ")} style={{gridArea: 'top', height: '100%', gap: '1em'}}>
          <Logo/>
        </div>
        <div className={[style.mainArea, style.pregameInfo].join(" ")} style={{gridArea: 'left'}}>
          <div style={{height: "370px"}}>
          <div style={{fontSize: "2em"}}>Seuraavaksi:</div>
          <div className={style.row} style={{justifyContent: 'space-between', paddingRight: "1em", alignItems: "center"}}>
            <div className={style.column}>
            <GameInfo hideIcon={true}/>
            <Estimate/>
            </div>
              <DeviceInfo/>
          </div>
          <div style={{height: "1.5em"}}></div>
            <div className={style.prePlayerRow}>
            <Fit2Box className={style.prePlayers} update={upd}>
              <div className={style.row} style={{justifyContent: 'space-between'}}>
                <PersonList role={"PLAYER"}/>
              </div>
            </Fit2Box>
              </div>
          </div>
          <div style={{height: "0.5em"}}></div>
            <div className={style.camera}>
              <DynamicHole id={'camera'} className={[style.camera].join(" ")} roundedCorners={{topR: true, topL: true, bottomL: true, bottomR: true}}></DynamicHole>
            </div>

        </div>

        <div className={style.mainArea} style={{gridArea: 'right'}}>
          <div className={style.iconHolder}>
            <GameIcon></GameIcon>
          </div>
        </div>
      </div>
      <DonateBar scheduleStart={0}/>
    </div>
  );
}
