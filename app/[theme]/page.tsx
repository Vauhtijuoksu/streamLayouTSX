"use client"
import {layouts} from "@/layouts/list";
import {AspectRatio, aspectRatios} from "@/schema/constant";
import {Layout} from "@/layouts/types";
import {useTheme} from "@/themes/ThemeContext";
import {themes} from "@/themes/list";

export default function LayoutList() {
  const {theme} = useTheme()
  return (
    <div style={{position: 'absolute', height: '100%', width: '100%', background: '#03232b', color: '#9edda8'}}>
      <div style={{textAlign: "center", fontSize: "3em", color: "#0dd3b5"}}>Theme: {theme} - Vauhtijuoksu Layouts</div>
      <table style={{width: "80%", margin: 'auto', fontSize: "2em", borderSpacing: "0.5em"}}>
        <thead>
          <tr>
            <td>
            </td>
            <td>
              Layout
            </td>
            <td>
              Game views
            </td>
            <td>
              Cameras
            </td>
            <td>
              description
            </td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(layouts).map((k) => <LayoutRow key={k} k={k} v={layouts[k]}/>)}
        </tbody>
      </table>
    </div>
  );
}

type LayoutRowProps = {
  k: string,
  v: Layout
}

const LayoutRow = ({
  k,
  v
}:LayoutRowProps) => {
  const {theme} = useTheme()

  const themeOptions = theme ? themes[theme] : undefined
  const excluded = (typeof themeOptions != 'undefined' && typeof themeOptions.excludeLayout != 'undefined' && themeOptions.excludeLayout.includes(k))
  return (
    <tr style={excluded ? {color: 'red', opacity: 0.6} : {}}>
      <td style={{textAlign: 'right', fontSize: "0.8em"}}>
        <a href={theme + "/" + k}>{k}</a>
      </td>
      <td>
        {v.displayName}
      </td>
      <td>
        x{v.gameViews} {v.gameViews != 0 ? <>{"( "}{Array.isArray(v.aspectRatio) ? v.aspectRatio.map((a, i) => <>{i > 0 ? ", " : ""}{getAspectratio(a)}</>) : getAspectratio(v.aspectRatio)}{" )"}</> : null}
      </td>
      <td>
        x{v.cameras}
      </td>
      <td style={{fontSize: "0.7em"}}>
        {v.description}
      </td>
    </tr>
  )
}

const getAspectratio = (a:AspectRatio) => {
 return typeof a != 'object' ? aspectRatios[a].x + ":" + aspectRatios[a].y : a.x + ":" + a.y
}
