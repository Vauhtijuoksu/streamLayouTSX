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
import {CounterDisplay, SpacedCounterDisplay} from "@/components/Display/Counter";

export const activeCounters:Layout = {
  displayName: 'activeCounters',
  cameras: 0,
  gameViews: 0,
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()

  return (
    <div className={[style.root, style.counterRoot].join(" ")} style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', flexWrap: "wrap"}}>
      <SpacedCounterDisplay index={0} height={"50vh"} width={"25vw"}/>
      <SpacedCounterDisplay index={1} height={"50vh"} width={"25vw"}/>
      <SpacedCounterDisplay index={2} height={"50vh"} width={"25vw"}/>
      <SpacedCounterDisplay index={3} height={"50vh"} width={"25vw"}/>
      <SpacedCounterDisplay index={4} height={"50vh"} width={"25vw"}/>
      <SpacedCounterDisplay index={5} height={"50vh"} width={"25vw"}/>
      <SpacedCounterDisplay index={6} height={"50vh"} width={"25vw"}/>
      <SpacedCounterDisplay index={7} height={"50vh"} width={"25vw"}/>
    </div>
  );
}
