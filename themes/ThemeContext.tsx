'use client'
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {defaultThemeConfig, themes} from "@/themes/list";
import {useParams} from "next/navigation";
import {layouts} from "@/layouts/list";
import {dayNightCycle} from "@/schema/constant";
import {Sponsor, ThemeConfig, ThemeProps} from "@/themes/types";
import {dBottomBarContent} from "@/themes/defaults";

const getTimeString = () => {
  const d = new Date()
  const hour = d.getHours()
  if (hour <= dayNightCycle.dayStart || hour >= dayNightCycle.dayEnd) return 'night'
  return 'day'
}

type StyleProviderProps = {
  style: {[key: string]: string}
  config: ThemeProps['config']
  sponsors: ThemeProps['sponsors']
}

export const StyleContext = createContext<StyleProviderProps|undefined>(undefined)


export const StyleProvider = ({
  children,
}:{children:ReactNode}) => {
  const {theme, time} = useTheme()
  const [style, setStyle] = useState<{[key: string]: string} | null>(null)
  const [config, setConfig] = useState<ThemeProps['config']>({})
  const [sponsors, setSponsors] = useState<ThemeProps['sponsors']>(undefined)
  useEffect(() => {
    if (theme && time){
      setStyle(new Proxy({theme: theme, time: time}, styleGetter))
      if (theme in themes) setConfig(themes[theme].config)
      if (theme in themes) setSponsors(themes[theme].sponsors)
    }
  }, [theme, time]);
  if (!style) return null
  return (
    <StyleContext.Provider value={{style, config, sponsors}}>
      {children}
    </StyleContext.Provider>
  )
}

export const useStyle = () => {
  const styleContext = useContext(StyleContext)
  if (typeof styleContext == 'undefined') {
    throw Error
  }
  return styleContext.style
}
export const useConfig = () => {
  const styleContext = useContext(StyleContext)
  if (typeof styleContext == 'undefined') {
    throw Error
  }
  const conf:ThemeConfig = {...(defaultThemeConfig ?? {}), ...(styleContext.config ?? {})}
  conf.bottomBarContent = {...dBottomBarContent, ...(conf.bottomBarContent ?? {})}
  return conf
}
export type SponsorSet = "default" | string
export const useSponsors = (ss: SponsorSet | SponsorSet[] = "default") => {
  const styleContext = useContext(StyleContext)
  if (typeof styleContext == 'undefined') {
    throw Error
  }
  const ssl = Array.isArray(ss) ? ss : [ss]
  const sponsors:Sponsor[] = []
  if (typeof styleContext.sponsors != "undefined"){
    return styleContext.sponsors.filter((s) => {
      const set = s.set?.selector ?? "default"
      return ssl.includes(set)
    })
  }
  return sponsors
}



export const styleGetter = {
  get(target:{[key: string]: string}, prop:string, s:string){
    const themeContext = {theme: target.theme, time: target.time}
    if (!themeContext) return ""
    const theme:ThemeProps = themes[themeContext.theme]
    return getThemeClasses(theme, themeContext.time, prop).join(" ")
  }
}

export const useTheme = () => {
  const [time, setTime] = useState<'day' | 'night'>(getTimeString())
  const [theme, setTheme] = useState<string | undefined>(undefined)
  const params = useParams()
  if (typeof params.theme == 'string' && Object.keys(themes).includes(params.theme) && theme != params.theme) setTheme(params.theme)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeString = getTimeString()
      if (time != timeString) setTime(timeString)
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);
  return {theme: theme, time: time}
}

export const useLayout = () => {
  const [layout, setLayout] = useState<string | null>(null)
  const params = useParams()
  if (typeof params.layout == 'string' && Object.keys(layouts).includes(params.layout) && params.layout != layout) setLayout(params.layout)
 return layout ? layouts[layout].component : null
}

const getThemeClasses = (theme:ThemeProps, time:string, cls:string) => {
  const clsses = []
  if (theme.extends) {
    const themeA = Array.isArray(theme.extends) ? theme.extends : [theme.extends]
    themeA.forEach((t:string) => {
      if (themes[t]) clsses.push(...getThemeClasses(themes[t], time, cls))
    })
  }
  if (theme.base[cls]) clsses.push(theme.base[cls])
  if (time == 'night' && theme.night && theme.night[cls]) clsses.push(theme.night[cls])
  return clsses
}

const target:{[key: string]: string} = {}
const cls = new Proxy(target, styleGetter)
