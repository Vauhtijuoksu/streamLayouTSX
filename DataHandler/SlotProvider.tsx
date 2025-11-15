"use client"

import {createContext, ReactNode, useEffect, useState} from "react";


export type Slot = {
  path: string[]
  for: {
    gameInfo?: boolean,
    counter?: boolean,
    timer?: boolean,
    player?: boolean,
    backseat?: boolean,
    studio?: boolean,
    heartRate?: boolean,
  }
  data?: {
    text?: string,
    counter?: number[],
    timer?: number[],
    player?: number[],
    backseat?: number[],
    studio?: number[],
    heartRate?: number[],
  }
}
type SlotProviderInterface = {
  slots: {[key:string]: Slot}
  updateSlot: (s:Slot, clear?:boolean) => void
}

export const SlotContext = createContext<SlotProviderInterface | undefined>(undefined)


export const SlotProvider = ({
  children,
}:{children:ReactNode}) => {
  const [slots, setSlots] = useState<{[key:string]: Slot}>({})

  const updateSlot = (s:Slot, clear?:boolean) => {
    console.log(s)
    const slotID = s.path.join("/")
    if (clear) {
      clearLocalStorageSlot(slotID)
      window.dispatchEvent(new StorageEvent('storage', {key: "SLOT:" + slotID, newValue: "CLEARED"}))
      return
    }
    const savedSlot = readLocalStorageSlot(slotID)
    if (savedSlot) {
      if (JSON.stringify(savedSlot) != JSON.stringify(s)){
        writeLocalStorageSlot(slotID, {...savedSlot, ...s})
        window.dispatchEvent(new StorageEvent('storage', {key: "SLOT:" + slotID, newValue: JSON.stringify(s), oldValue: JSON.stringify(savedSlot)}))
      }
    } else {
      writeLocalStorageSlot(slotID, s)
      window.dispatchEvent(new StorageEvent('storage', {key: "SLOT:" + slotID, newValue: JSON.stringify(s)}))
    }
  }
  useEffect(() => {
    const onStorageEvent = (ev:StorageEvent) => {
      if (ev.key){
        const k = ev.key.split(":")
        if (k.length == 2 && k[0] == "SLOT"){
          if (ev.newValue == "CLEARED"){
            delete slots[k[1]]
            setSlots(slots)
          } else if (ev.newValue) {
            const slot:Slot = JSON.parse(ev.newValue)
            slots[k[1]] = slot
            setSlots(slots)
          }
        }
      }
    }
    window.addEventListener('storage', onStorageEvent)
    return () => {
      window.removeEventListener('storage', onStorageEvent)
    }
  }, [slots]);


  return (
    <SlotContext.Provider value={{slots, updateSlot}}>
      {children}
    </SlotContext.Provider>
  )
}


const readLocalStorageSlot = (slotID:string)=> {
  const field = localStorage.getItem("SLOT:"+slotID);
  if(field && field != 'undefined') {
    const parsed = JSON.parse(field)
    if (parsed) return parsed as Slot
  }
  return undefined
}

const writeLocalStorageSlot = (slotID:string, slot:Slot)=> {
  localStorage.setItem("SLOT:"+slotID, JSON.stringify(slot));
}

const clearLocalStorageSlot = (param:string)=> {
  localStorage.removeItem("SLOT:"+param);
}

