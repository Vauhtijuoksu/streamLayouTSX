"use client";

import {StyleProvider, useLayout, useTheme} from "@/themes/ThemeContext";
import {MaskProvider} from "@/components/Holes/Masker";
import Providers from "@/DataHandler/Providers";



export default function Layout() {
  const {theme, time} = useTheme()
  const layoutComponent = useLayout()
  if (!theme) return null
  if (!layoutComponent) return <p>Not found</p>
  return (
    <Providers>
      <StyleProvider>
        <MaskProvider>
          {layoutComponent(undefined)}
        </MaskProvider>
      </StyleProvider>
    </Providers>
  )
}

