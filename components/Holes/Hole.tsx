import masking from "./Masking.module.css"
import {useConfig, useStyle} from "@/themes/ThemeContext";
import {CSSProperties, ReactNode, useContext, useEffect, useRef, useState} from "react";

import {MaskContext, MaskStatusContext} from "@/components/Holes/Masker";

export type HoleProps = {
  id:string
  holeElement: HTMLDivElement
  roundedCorners: RoundedCorners<number> | number,
}
export type RoundedCorners<T> = {
  topL: T,
  topR: T,
  bottomL: T,
  bottomR: T
}

export const getRoundedCorners = (rc:Partial<RoundedCorners<boolean>> | boolean | undefined, defRC: number) => {
  if (typeof rc == 'boolean' || typeof rc == 'undefined') {
    return defRC * (rc ? 1 : 0)
  } else {
    return {
      topL: defRC * (rc.topL ? 1 : 0),
      topR: defRC * (rc.topR ? 1 : 0),
      bottomL: defRC * (rc.bottomL ? 1 : 0),
      bottomR: defRC * (rc.bottomR ? 1 : 0),
    }
  }
}

export const Hole = ({
  holeElement,
  roundedCorners: cr,
}:HoleProps) => {
  const [rect, setRect] = useState<{x: number, y: number, w: number, h: number} | undefined>(undefined)
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const domRect = holeElement.getBoundingClientRect()
      setRect({x: domRect.x, y: domRect.y, w: domRect.width, h: domRect.height})
    });
    resizeObserver.observe(holeElement);
    const positionObserver = new IntersectionObserver(() => {
      const domRect = holeElement.getBoundingClientRect()
      setRect({x: domRect.x, y: domRect.y, w: domRect.width, h: domRect.height})
    });
    positionObserver.observe(holeElement)
    // Cleanup function
    return () => {
        resizeObserver.disconnect();
        positionObserver.disconnect();
    };

  }, [holeElement]);

  if (!rect) return null
  return (
    <>
      {typeof cr == "number" ?
        <HoleRect {...rect} cr={cr}/>
        :
        <>
          <HoleRect {...rect} cr={cr.topL} corner={{x: 0, y: 0}}/>
          <HoleRect {...rect} cr={cr.topR} corner={{x: 1, y: 0}}/>
          <HoleRect {...rect} cr={cr.bottomL} corner={{x: 0, y: 1}}/>
          <HoleRect {...rect} cr={cr.bottomR} corner={{x: 1, y: 1}}/>
        </>
      }
    </>
  );
}
type HoleRectProps = {
  x: number,
  y: number,
  w: number,
  h: number,
  cr: number,
  corner?: {x: 1 | 0, y: 1 | 0},
}
const HoleRect = ({corner, ...p}:HoleRectProps) => {
  const hasCorner = typeof corner != 'undefined'
  return (
    <rect className={masking.cornerd}
      x={hasCorner ? p.x + (Math.floor(p.w/2) - p.cr -1)*corner.x : p.x}
      y={hasCorner ? p.y + (Math.floor(p.h/2) - p.cr -1)*corner.y : p.y}
      width={hasCorner ? Math.ceil(p.w/2) + p.cr + corner.x : p.w}
      height={hasCorner ? Math.ceil(p.h/2) + p.cr + corner.y : p.h}
      rx={p.cr}
      ry={p.cr}
      fill="#000000"
    />
  )
}

type DynamicHoleProps = {
  id: string,
  roundedCorners?: Partial<RoundedCorners<boolean>> | boolean,
  style?: CSSProperties,
  className?: string
  children?: ReactNode
}

export const DynamicHole = ({
  id,
  roundedCorners:inCr,
  className,
  children
}:DynamicHoleProps) => {
  const isMasked = useContext(MaskStatusContext)
  const style = useStyle()
  const {defaultCornerRadius: dcr} = useConfig()
  const cr = getRoundedCorners(inCr, dcr ?? 0)
  const borderRadius:CSSProperties = {borderRadius: (typeof cr == "number" ? cr + "px" : `${cr.topL + "px"} ${cr.topR + "px"} ${cr.bottomR + "px"} ${cr.bottomL + "px"}`)}


  return (
    <HoleAdder id={id} roundedCorners={cr} className={[style.full, className].join(" ")} dummy={isMasked}>
      <div className={[style.border, masking.overlay].join(" ")} style={{width: '100%', height: '100%', ...borderRadius}}>
        {children}
      </div>
    </HoleAdder>
  )
}
type HoleAdderProps = {
  roundedCorners: RoundedCorners<number> | number,
  className?: string,
  id: string
  children?: ReactNode,
  style?: CSSProperties,
  dummy?: boolean
}

export const HoleAdder = ({
  roundedCorners,
  className,
  id,
  style,
  children,
  dummy = false,
}:HoleAdderProps) => {
  const {holes, addHole} = useContext(MaskContext)
  const holeRef = useRef<HTMLDivElement | null>(null)
  const [pushed, setPushed] = useState(false)
  useEffect(() => {
    if (holeRef.current && holes && !pushed && addHole && !dummy) {
      if (!(id in holes)){
        addHole(id, <Hole key={id} id={id} roundedCorners={roundedCorners} holeElement={holeRef.current}/>)
        setPushed(true)
      }
    }
  }, [holeRef, holes, pushed, roundedCorners, id, addHole, dummy]);
  return (
    <div ref={holeRef} className={className} style={{position: "relative", ...style}}>
      {children}
    </div>
  )
}