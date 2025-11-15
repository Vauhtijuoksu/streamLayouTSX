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
import {Logo} from "@/components/Display/Logo";
import {Layout} from "@/layouts/types";
import {aspectRatios} from "@/schema/constant";

export const fourThree:Layout = {
  displayName: '3:4 Default',
  cameras: 1,
  gameViews: 1,
  aspectRatio: "FourThree",
  component: (props:LayoutComponentProps) => <LayoutComponent {...props}/>
}

const LayoutComponent = (props:LayoutComponentProps) => {
  const style = useStyle()
  const config = useConfig()
  return (
    <div className={style.root} style={config.defaultCornerRadius ? {'--borderRadius': config.defaultCornerRadius + "px"} as CSSProperties : {}}>
      <div className={[style.layout, style.fourThree].join(" ")}>
        <div className={style.leftBar}>
          <Logo/>
          <div className={style.content}>
            <div className={style.sponsors}>
              <SponsorDisplay/>
            </div>
            <MainTimer/>
            <div className={style.row} style={{justifyContent: 'space-between', alignItems: 'center'}}>
              <GameInfo/>
              <DeviceInfo/>
            </div>
          </div>
          <div className={[style.overCamInfo, style.hideIfEmpty, style.border, masking.overlay].join(" ")}>
            <PersonList role={"BACKSEAT"}/>
            <PersonList role={"PLAYER"}/>
          </div>
          <div className={style.camera}>
            <DynamicHole id={'camera'} className={style.camera} roundedCorners={{topR: true}}></DynamicHole>
          </div>
        </div>
        <div className={style.gameView}>
          <GameView id={"1"} ratio={"FourThree"} height={1000} roundedCorners={{}}/>
        </div>
      </div>
      <DonateBar/>
    </div>
  );
}
