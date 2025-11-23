"use client"
import {LayoutComponentProps} from "@/layouts/list";
import {GameView} from "@/components/GameView";
import {DynamicHole} from "@/components/Holes/Hole";
import {PersonList, PersonListHalf} from "@/components/PersonList";
import masking from "@/components/Holes/Masking.module.css";
import {useConfig, useStyle} from "@/themes/ThemeContext";
import {CSSProperties} from "react";
import {DonateBar} from "@/components/DonateBar/DonateBar";
import {MainTimer} from "@/components/Display/Timer";
import {GameInfo} from "@/components/Display/GameInfo";
import {DeviceInfo} from "@/components/Display/DeviceInfo";
import {SponsorDisplay} from "@/components/Display/Sponsors";
import {Logo} from "@/components/Display/Logo";
import {Layout} from "@/layouts/types";
import {aspectRatios} from "@/schema/constant";
import {IncentiveOpen} from "@/DataHandler/api";
import {TempRaceTimerDisplay} from "@/components/temp/RaceTimer";


export const sixteenNineDuoCorneredRightOnTop:Layout = {
  displayName: '16:9 Duo Overlapping Right on top',
  cameras: 1,
  gameViews: 2,
  aspectRatio: "SixteenNine",
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}
export const sixteenNineDuoCorneredLeftOnTop:Layout = {
  ...sixteenNineDuoCorneredRightOnTop,
  displayName: '16:9 Duo Overlapping Left on top',
  component: (props:LayoutComponentProps) => <LayoutComponent.alt {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.sixteenNineDuoCornered, style.sixteenNineDuoCorneredLowerOnTop].join(" ")}>
        <LayoutComponent.content style={style}></LayoutComponent.content>
      </div>
      <DonateBar/>
    </div>
  );
}

LayoutComponent.alt = function AltComponent(props:LayoutComponentProps){
  const style = useStyle()
  const config = useConfig()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.sixteenNineDuoCornered, style.sixteenNineDuoCorneredUpperOnTop].join(" ")}>
       <LayoutComponent.content style={style}></LayoutComponent.content>
      </div>
      <DonateBar/>
    </div>
  );
}
type ContentProps = {
  style:{[key:string]:string}
}
LayoutComponent.content = function Content({
    style
}:ContentProps){
  return (
    <>
      <div className={style.gameView}>
        <GameView id={"1"} ratio={"SixteenNine"} width={1080} roundedCorners={{bottomR: true}}>
          <TempRaceTimerDisplay id={"t1"} corner={"BL"} others={["t2"]}/>
        </GameView>
      </div>
      <div className={style.topRight}></div>
      <div className={[style.gameView, style.gameView2].join(" ")}>
        <GameView id={"2"} ratio={"SixteenNine"} width={1080} roundedCorners={{topL: true}}>
          <TempRaceTimerDisplay id={"t2"} corner={"BR"} others={["t1"]}/>
        </GameView>
      </div>
      <div className={style.bottomLeft}>
        <div className={style.column} style={{width: "100%", height: "100%"}}>
          <div className={style.row} style={{marginRight: "0.85em"}}>
            <Logo/>
            <MainTimer/>
          </div>
          <div className={style.row} style={{height: "100%"}}>
            <div className={style.column} style={{width: "300px"}}>
              <div className={[style.overCamInfo, style.hideIfEmpty, style.border, masking.overlay].join(" ")}>
                <PersonList role={"BACKSEAT"}/>
                <PersonList role={"PLAYER"}/>
              </div>
              <div className={style.camera}>
                <DynamicHole id={'camera'} className={style.camera} roundedCorners={{topR: true}}></DynamicHole>
              </div>
            </div>
            <div className={style.column} style={{flex: 1}}>
              <div className={style.row} style={{padding: "0.1em 0.8em"}}>
                <GameInfo/>
              </div>
              <div className={style.row} style={{justifyContent: 'space-between', alignItems: 'flex-start', gap: '2em', padding: "0.1em 0.8em", flex: 1}}>
                <div className={style.sponsors} style={{height: "100%"}}>
                  <SponsorDisplay/>
                </div>
                <DeviceInfo/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}