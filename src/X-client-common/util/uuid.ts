export function uid(): string {
  return (Date.now() + Math.floor(Math.random() * 0x1000000)).toString(16).substr(1)
}
