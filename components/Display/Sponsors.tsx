import {SponsorSet, useSponsors, useStyle} from "@/themes/ThemeContext";
import {Roller} from "@/components/Roller/Roller";
import {useState} from "react";


type SponsorDisplayProps = {
  sponsorSet: SponsorSet | SponsorSet[]
}

export const SponsorDisplay = ({
  sponsorSet = 'default',
}:SponsorDisplayProps) => {
  const sponsors = useSponsors(sponsorSet)
  const style = useStyle()
  const [label, setLabel] = useState("")
  if (sponsors.length == 0) return null
  const onRollerChange = (n: number) => {
    setLabel(sponsors[n]?.set?.label ?? "Yhteistyössä")
  }
  return (
    <div style={{position: "relative", height:"100%", width:"100%", display: 'flex', flexDirection: 'column'}}>
      <div className={style.sponsorHeader}>{label}</div>
      <div style={{flexGrow: 1, position: 'relative'}}>
      <Roller showOverFlow={true} onChange={onRollerChange} rollElements={sponsors.map((s, i) => <div key={i} className={style.sponsor}><img src={"/sponsorLogos/"+s.icon} alt={s.name ?? ""}/></div>)} delaySeconds={20} sideWays fade/>
      </div>
    </div>
  )
}