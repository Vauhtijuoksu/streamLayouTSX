

export const roundAmount = (n:number) => {
  if (n != Math.round(n)) return Number(n.toFixed(2))
  return n
}