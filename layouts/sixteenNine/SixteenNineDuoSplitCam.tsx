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


export const sixteenNineDuoSplitCam:Layout = {
  displayName: '16:9 Duo SplitCam',
  cameras: 2,
  gameViews: 2,
  aspectRatio: "SixteenNine",
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}


const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.sixteenNineDuoSplitCam].join(" ")}>
        <div className={style.topBar}>
          <div className={[style.playerNameBlobLeft, style.hideIfEmpty, style.border, masking.overlay].join(" ")}>
            <PersonListHalf role={"PLAYER"} half={1}/>
          </div>
          <Logo/>
          <div className={[style.playerNameBlobRight, style.hideIfEmpty, style.border, masking.overlay].join(" ")}>
            <PersonListHalf role={"PLAYER"} half={2}/>
          </div>
        </div>
        <div className={style.gameView}>
          <GameView id={"1"} ratio={"SixteenNine"} width={955} roundedCorners={{bottomR: true, topR: true}}/>
        </div>
        <div className={style.midBar}></div>
        <div className={[style.gameView, style.gameView2].join(" ")}>
          <GameView id={"2"} ratio={"SixteenNine"} width={955} roundedCorners={{bottomL: true, topL: true}}/>
        </div>
        <div className={style.bottomBar}>
          <div style={{height: "100%", width: "300px"}}>
            <DynamicHole id={'cameraLeft'} className={style.camera} roundedCorners={{topR: true}}/>
          </div>
          <div className={style.column} style={{justifyContent: 'space-between', gap: '0.5em', height: '100%'}}>
            <div className={style.row} style={{justifyContent: 'space-between', alignItems: 'center', gap: '2em'}}>
            <MainTimer/>
              <DeviceInfo/>
            </div>
            <GameInfo/>
            <div className={style.row}>
              <PersonList role={"BACKSEAT"}/>
            </div>
          </div>
          <div className={style.sponsors} style={{height: "100%"}}>
            <SponsorDisplay/>
          </div>
          <div style={{height: "100%", width: "300px"}}>
            <DynamicHole id={'cameraRight'} className={style.camera} roundedCorners={{topL: true}}/>
          </div>
        </div>
      </div>
      <DonateBar/>
    </div>
  );
}
