"use client"
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Hole, HoleProps} from "@/components/Holes/Hole";
import masking from "./Masking.module.css"


type MaskProviderInterface = {
  addHole?: (k: string, e:ReactNode) => void
  holes?: {[key:string]: ReactNode}
}

export const MaskContext = createContext<MaskProviderInterface>({})


export const MaskProvider = ({
  children,
}:{children:ReactNode}) => {
  const [holes] = useState<{[key:string]: ReactNode}>({})
  const [holeUpdate, setHoleUpdate] = useState(0)
  const addHole = (k: string, e:ReactNode) => {
    holes[k] = e
    setHoleUpdate(Date.now())
  }

  return (
    <MaskContext.Provider value={{addHole, holes}}>
      <Mask/>
      <MaskStatusProvider masked={true}>
        {children}
      </MaskStatusProvider>
      <MaskStatusProvider masked={false}>
        {children}
      </MaskStatusProvider>
    </MaskContext.Provider>
  )
}


export const Mask = () => {
  const {holes} = useContext(MaskContext)

  console.log("doin holes", holes)
  if (typeof holes == 'undefined') return null
  return (
    <svg width={1920} height={1080} viewBox={`0 0 ${1920} ${1080}`}>
      <mask id={"HOLES"} maskUnits="objectBoundingBox">
        <rect x="0" y="0" width={1920} height={1080} fill="#FFFFFF"/>
        {Object.values(holes)}
      </mask>
    </svg>
  )
}

export const MaskStatusContext = createContext<boolean>(false)

export const MaskStatusProvider = ({
  children,
  masked,
}:{children:ReactNode, masked: boolean}) => {
  return (
    <MaskStatusContext.Provider value={masked}>
      <div className={masked ? masking.masked : masking.unmasked} style={{position:'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex:0}}>
        {children}
      </div>
    </MaskStatusContext.Provider>
  )
}
