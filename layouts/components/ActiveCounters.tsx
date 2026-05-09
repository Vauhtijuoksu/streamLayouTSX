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
import {CounterDisplay} from "@/components/Display/Counter";

export const activeCounters:Layout = {
  displayName: 'activeCounters',
  cameras: 0,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()

  return (
    <div className={[style.root, style.counterRoot].join(" ")} style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row', height: '50%'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={0}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={1}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={2}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={3}/>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '50%'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={4}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={5}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={6}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={7}/>
        </div>
      </div>
    </div>
  );
}
