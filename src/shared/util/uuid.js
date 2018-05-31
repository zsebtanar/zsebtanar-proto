export function guid() {
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export function uid() {
  return (Date.now() + Math.floor(Math.random() * 0x1000000)).toString(16).substr(1)
}
