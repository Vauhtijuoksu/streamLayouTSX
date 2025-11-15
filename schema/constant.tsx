
export type Vec2 = {x:number, y:number}
export const v2 = (x:number,y?:number):Vec2 => {
  return {x:x,y:y ?? x}
}

export type Role = 'PLAYER' | 'BACKSEAT' | 'STUDIO'

export const aspectRatios:{[key: string]: Vec2} = {
  SixteenNine: {x: 16, y:9},
  FourThree: {x:4, y:3}
}
type CustomAspectRatio = Vec2
export type AspectRatio = keyof typeof aspectRatios | CustomAspectRatio

export const dayNightCycle = {
  dayStart: 7,
  dayEnd: 22
}