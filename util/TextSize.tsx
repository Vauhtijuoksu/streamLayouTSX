"use client"
import {createContext, CSSProperties, ReactNode, useEffect, useRef, useState} from "react";
import {useStyle} from "@/themes/ThemeContext";

const useNumberSize = {

}
interface TextSizeProviderInterface {
  numberSize?: {max: {x: number, y:number}, avg: {x: number, y:number}},
}

export const TextSizeContext = createContext<TextSizeProviderInterface>({numberSize: undefined})


export const TextSizeProvider = ({
  children,
}:{children:ReactNode}) => {
  const [numberSize, setNumberSize] = useState<TextSizeProviderInterface["numberSize"]>()
  return (
    <TextSizeContext.Provider value={{numberSize}}>
      <TextSizeTester text={"1234567890"} sizeSetter={setNumberSize}/>
      {children}
    </TextSizeContext.Provider>
  )
}
type TextSizeTesterProps = {
  text: string,
  sizeSetter: CallableFunction
  className?: string
}
const textSizeTesterStyle:CSSProperties = {
  margin:0,
  padding:0,
  position: "absolute",
  visibility: 'hidden'
}

type TextSizeCheckComponentProps = {
  text: string,
  children: ReactNode,
  varPreText?: string
  className?: string
  sizerClass?: string
}
export const TextSizeCheckComponent = ({
  text,
  children,
  varPreText = "text",
  className,
  sizerClass
}:TextSizeCheckComponentProps) => {
  const [textSize, setTextSize] = useState<TextSizeProviderInterface["numberSize"]>()
  const [vars, setVars] = useState<CSSProperties>({})
  useEffect(() => {
    if (textSize) {
      setVars({
        ["--" + varPreText + "WidthMax"]: textSize.max.x,
        ["--" + varPreText + "HeightMax"]: textSize.max.y,
        ["--" + varPreText + "WidthAvg"]: textSize.avg.x,
        ["--" + varPreText + "HeightAvg"]: textSize.avg.y,

      } as CSSProperties)
    }
  }, [textSize, varPreText]);
  return (
    <div style={vars} className={className}>
      <TextSizeTester text={text} sizeSetter={setTextSize} className={sizerClass}/>
      {children}
    </div>
  )
}

const TextSizeTester = ({
  text,
  sizeSetter,
  className,
}:TextSizeTesterProps) => {
  const height = useRef<HTMLDivElement>(null)
  const width = useRef<HTMLDivElement>(null)
  const split = text.split('').map((s,i) => {return <div key={i}>{s}</div>})
  useEffect(() => {
    if (height.current && width.current) {
      const hRect = height.current.getBoundingClientRect()
      const wRect = width.current.getBoundingClientRect()
      sizeSetter({
        max: {
          x: wRect.width,
          y: hRect.height,
        },
        avg: {
          x: (hRect.width/text.length),
          y: (wRect.height/text.length)
        }
      })
    }
  }, [height, width, text, sizeSetter]);
  return (
    <>
      <div ref={height} className={className} style={{whiteSpace:'nowrap', ...textSizeTesterStyle}}>{text}</div>
      <div ref={width} className={className} style={{...textSizeTesterStyle}}>{split}</div>
    </>
  )
}

type Fit2BoxProps = {
  children: string
  minScale?: number
  className?: string
}

export const Fit2Box = ({
  children,
  className,
}:Fit2BoxProps) => {
  const sizeTester = useRef<HTMLDivElement>(null)
  const sizeTesterLine = useRef<HTMLDivElement>(null)
  const style = useStyle()
  const [scale, setScale] = useState(1)
  const [reScale, setReScale] = useState(0)


  useEffect(() => {
    setReScale(Date.now())
    setScale(1)
  }, [children]);
  useEffect(() => {
     if (sizeTester.current && sizeTesterLine.current) {
        const line = sizeTesterLine.current.getBoundingClientRect()
        const nonline = sizeTester.current.getBoundingClientRect()
        setScale(Math.min(1, nonline.width / line.width))
     }
  }, [reScale]);

  return (
    <div className={className} style={{width: "100%", position: 'relative'}}>
      <div ref={sizeTester} style={{position: 'absolute', left: 0, right: 0}}>
        <div ref={sizeTesterLine} style={{whiteSpace: 'nowrap', position: 'absolute', visibility: 'hidden'}}>{children}</div>
      </div>
      <div className={style.fontScaler} style={{'--fontScale': Math.floor(100*scale)/100} as CSSProperties}>
        {children}
      </div>
    </div>
  )
}