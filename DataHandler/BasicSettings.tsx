import {useEffect, useState} from "react";


const defaultValue:{APIURL: BasicSettings['APIURL'], dataSource: BasicSettings["dataSource"]} = {
  APIURL: 'https://api.dev.vauhtijuoksu.fi/',
  dataSource: 'api'
}

const readLocalStorage = (param:string, setter:CallableFunction, defaultValue:string)=> {
  const field = localStorage.getItem(param);
    if(field && field != defaultValue) setter(field)
    if (!field) {
      localStorage.setItem(param, defaultValue)
    }
}

export type BasicSettings = {
  APIURL: string
  setAPIURL: CallableFunction
  dataSource: 'api' | 'override' | 'manual'
  setDataSource: CallableFunction
  isPending: boolean
}


export const useSettings = ():BasicSettings => {
  const [APIURL, setAPIURL] = useState<string>(defaultValue.APIURL)
  const [dataSource, setDataSource] = useState<BasicSettings['dataSource']>(defaultValue.dataSource)
  const [isPending, setIsPending] = useState<boolean>(true)
  useEffect(() => {
    readLocalStorage("APIURL", setAPIURL, APIURL)
    readLocalStorage("dataSource", setDataSource, dataSource)
    setIsPending(false)
  }, [])
  return {APIURL, setAPIURL, dataSource, setDataSource, isPending}
}

export const useReload = () => {
  const [reload, setReload] = useState<string>("0")
  useEffect(() => {
    const interval = setInterval(() => {
      const field = localStorage.getItem('reloadAll');
      if (field && field != reload) setReload(field)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return {reload}
}

