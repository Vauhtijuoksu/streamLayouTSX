"use client"

import Providers from "@/DataHandler/Providers";

export default function Reset() {
  return (
    <Providers poll={false}>
      <Resetter/>
    </Providers>
  );
}

const Resetter = () => {
  const resetLocalStorage = (s:string) => {
    for (const key in localStorage){
      if (s == "all") {
        localStorage.removeItem(key)
      }
      const skey = key.split(":")
      if (skey.length == 1 && s == "settings"){
        localStorage.removeItem(key)
      }
      if (skey.length == 2 && skey[0] == s){
        localStorage.removeItem(key)
      }
    }
  }
  return (

    <div>
      <div>
        What do you want to reset?
      </div>
      <button onClick={() => resetLocalStorage("all")}>Everything</button>
      <br/>
      <button onClick={() => resetLocalStorage("settings")}>SETTINGS</button>
      <br/>
      <button onClick={() => resetLocalStorage("SLOT")}>SLOT:*</button>
      <button onClick={() => resetLocalStorage("USE")}>USE:*</button>
      <button onClick={() => resetLocalStorage("API")}>API:*</button>
    </div>
  )

}
