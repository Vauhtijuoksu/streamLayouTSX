"use client"

import {ReactNode, useEffect, useRef, useState} from "react";
import {useSettings} from "@/DataHandler/BasicSettings";
import {ApiClient} from "@/DataHandler/api";
import {usePathname} from "next/navigation";

const METADATA_POLLS_PERMINUTE = 120

export const ApiWrapper = ({
  children,
}:{children:ReactNode}) => {
  const [apiClient, setApiClient] = useState<ApiClient | undefined>(undefined)
  const [startLoop, setStartLoop] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)
  const {dataSource, APIURL, isPending} = useSettings()
  const pathname = usePathname().split("/")
  const isDock = (pathname.length > 0 && pathname[1] == "dock")
  useEffect(() => {
    if (!isPending){
      if (isDock){
        if (dataSource != "api") setApiClient(new ApiClient(APIURL, true))
      } else {
        if (dataSource == "api") setApiClient(new ApiClient(APIURL, true))
      }
      setStartLoop(true)
    }
  }, [dataSource, APIURL, isPending]);

  useEffect(() => {
    if (startLoop && apiClient){
      apiClient.initData()
      timeout.current = setInterval(() => {
        apiClient.getMetadata()
        apiClient.getDonations()
      }, (60/METADATA_POLLS_PERMINUTE) * 1000)
    }
    return () => {
      if (timeout.current) clearInterval(timeout.current)
    }
  }, [startLoop, apiClient]);

  return <>{children}</>
}


