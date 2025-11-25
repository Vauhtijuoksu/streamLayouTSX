"use client"
import {LayoutComponentProps} from "@/layouts/list";
import {GameView} from "@/components/GameView";
import {DynamicHole} from "@/components/Holes/Hole";
import {PersonList} from "@/components/PersonList";
import masking from "@/components/Holes/Masking.module.css";
import {useConfig, useStyle} from "@/themes/ThemeContext";
import {CSSProperties} from "react";
import {DonateBar} from "@/components/DonateBar/DonateBar";
import {MainTimer} from "@/components/Display/Timer";
import {GameInfo} from "@/components/Display/GameInfo";
import {DeviceInfo} from "@/components/Display/DeviceInfo";
import {SponsorDisplay} from "@/components/Display/Sponsors";
import {ScheduleDisplay} from "@/components/Display/Schedule";
import {IncentiveRollerDisplay} from "@/components/Display/Incentives";
import {Logo} from "@/components/Display/Logo";
import {NowPlaying} from "@/components/Display/NowPlaying";
import {Layout} from "@/layouts/types";
import {aspectRatios} from "@/schema/constant";

export const pause:Layout = {
  displayName: 'Pause',
  cameras: 1,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.pause].join(" ")}>
        <div className={[style.mainArea, style.column].join(" ")} style={{gridArea: 'topLeft', height: '100%', gap: '1em'}}>
          <Logo/>
          <div className={style.column} style={{justifyContent: 'center', alignItems: 'center', flexGrow: 1}}>
            <ScheduleDisplay fallBack={<div className={style.scheduleFallBack}/>}/>
          </div>
        </div>
        <div className={style.mainArea} style={{gridArea: 'topRight'}}>
          <DynamicHole id={'camera'} className={style.breakCamera} roundedCorners={{bottomL: true}}>
          </DynamicHole>
        </div>
        <div className={style.mainArea} style={{gridArea: 'bottomLeft'}}>
          <div style={{width: "90%", height:"95%", margin:"2.5% 5%", display: 'flex', flexDirection: 'column'}}>
            <IncentiveRollerDisplay fallBack={<div className={style.incentiveFallBack}/>}/>
          </div>
        </div>
        <div className={style.mainArea} style={{gridArea: 'bottomRight'}}>
            <div className={style.sponsors}>
              <SponsorDisplay/>
            </div>
        </div>
      </div>
      <DonateBar scheduleStart={0}/>
    </div>
  );
}
