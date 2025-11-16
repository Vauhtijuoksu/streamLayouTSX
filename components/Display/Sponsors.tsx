import {useSponsors, useStyle} from "@/themes/ThemeContext";
import {Roller} from "@/components/Roller/Roller";


export const SponsorDisplay = () => {
  const sponsors = useSponsors()
  const style = useStyle()
  console.log(sponsors)
  if (sponsors.length == 0) return null
  return (
    <div style={{position: "relative", height:"100%", width:"100%", display: 'flex', flexDirection: 'column'}}>
      <div className={style.sponsorHeader}>Yhteistyössä:</div>
      <div style={{flexGrow: 1, position: 'relative'}}>
      <Roller showOverFlow={true} rollElements={sponsors.map((s, i) => <div key={i} className={style.sponsor}><img src={"/sponsorLogos/"+s} alt={""}/></div>)} delaySeconds={20} sideWays fade/>
      </div>
    </div>
  )
}