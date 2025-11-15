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
import {Layout} from "@/layouts/types";

export const yappingDuoCam:Layout = {
  displayName: 'Pause Yapping Duo Cam',
  cameras: 2,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.yappingDuoCam].join(" ")}>
        <div className={style.mainArea} style={{gridArea: 'left'}}>
          <DynamicHole id={'camera2'} className={style.breakBigCamera}></DynamicHole>
        </div>
        <div className={style.mainArea} style={{gridArea: 'mid', height: "100%", width:"100%"}}>
        </div>
        <div className={style.mainArea} style={{gridArea: 'topRight'}}>
          <DynamicHole id={'camera'} className={style.breakCamera} roundedCorners={{bottomL: true}}></DynamicHole>
        </div>
        <div className={[style.mainArea, style.column].join(" ")} style={{gridArea: 'bottomRight', height: '100%', gap: '1em'}}>
          <Logo/>
          <div className={style.sponsors}>
            <SponsorDisplay/>
          </div>
        </div>
      </div>
      <DonateBar/>
    </div>
  );
}
