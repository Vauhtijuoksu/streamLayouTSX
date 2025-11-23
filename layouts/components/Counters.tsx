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

export const counters:Layout = {
  displayName: 'Counters',
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
          <CounterDisplay index={0} forceRender/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={1} forceRender/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={2} forceRender/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={3} forceRender/>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '50%'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={4} forceRender/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={5} forceRender/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={6} forceRender/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
          <CounterDisplay index={7} forceRender/>
        </div>
      </div>
    </div>
  );
}
