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

export const componentList:Layout = {
  displayName: 'ComponentList',
  cameras: 0,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={style.layout}>
        <div style={{width: "900px", border: "1px solid black", padding: "20px"}}>
          <NowPlaying/>
        </div>
        <div style={{width: "1800px", border: "1px solid black", padding: "20px"}}>
          <NowPlaying/>
        </div>
        <div style={{display: 'flex', flexDirection:'row'}}>
          <div style={{height: "300px", flexGrow: 1}}>
            <ScheduleDisplay fallBack={<div className={style.scheduleFallBack}/>}/>
          </div>
          <div style={{height: "300px", flexGrow: 1}}>
          <IncentiveRollerDisplay onSlide={1} fallBack={<div className={style.incentiveFallBack} />}/>
          </div>

        </div>
        <div style={{display: 'flex', flexDirection:'row'}}>
          <div style={{height: "300px", width: "50%"}}>
          <div className={style.sponsors} style={{height: "100%"}}>
            <SponsorDisplay/>
          </div>
          </div>
        </div>
      </div>
      <DonateBar scheduleStart={0}/>
    </div>
  );
}
