import {ReactNode} from "react";

enum ValueDisplayType {
  default,
  Time,
  Player,
}
type RenderingFunc<T> = (v:T) => ReactNode

type ValueDisplayProps<T> = {
  attribute: string
  register?: boolean
  className: string
}

const ValueDisplay = <T, >({
  attribute,
  register = false,
  className
}:ValueDisplayProps<T>) => {
  const value:ReactNode = "lol" //useValue(attribute)

  return (
    <div className={className}>
      {value}
    </div>
  )
}
