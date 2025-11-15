"use client";

import {StyleProvider, useLayout, useTheme} from "@/themes/ThemeContext";
import {MaskProvider} from "@/components/Holes/Masker";



export default function Layout() {
  const {theme, time} = useTheme()
  const layoutComponent = useLayout()
  if (!theme) return null
  if (!layoutComponent) return <p>Not found</p>
  return (
    <StyleProvider>
      <MaskProvider>
        {layoutComponent(undefined)}
      </MaskProvider>
    </StyleProvider>
  )
}

