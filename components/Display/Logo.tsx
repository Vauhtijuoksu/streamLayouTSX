import {useStyle} from "@/themes/ThemeContext";

export const Logo = () => {
  const style = useStyle()
  return (
    <div className={style.logoHolder}>
      <div className={style.logo}/>
    </div>
  )
}