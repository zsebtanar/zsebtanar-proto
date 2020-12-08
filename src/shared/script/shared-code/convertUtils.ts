import { PLNumber, PLString, plNumber } from 'pocket-lisp-stdlib'
import { typeCheck } from './utils'

const conversionTable = {
  mass: {
    mg: 0.001,
    g: 1,
    dkg: 100,
    kg: 1000,
    t: 1000000,
  },
  time: {
    s: 1,
    mp: 1,
    sec: 1,
    min: 60,
    p: 60,
    h: 3600,
    ó: 3600,
    óra: 3600,
    wk: 604800,
    hét: 604800,
  },
  length: {
    mm: 0.001,
    cm: 0.01,
    dm: 0.1,
    m: 1,
    km: 1000,
  },
  angle: {
    deg: 1,
    rad: 180 / Math.PI,
  },
}

export function convert(from: PLString, to: PLString): PLNumber {
  for (const unitType in conversionTable) {
    const units = conversionTable[unitType]
    if (from.value in units) {
      if (to.value in units) {
        const numConverted = units[from.value] / units[to.value]
        return plNumber(numConverted)
      } else {
        throw new Error(`Units "${from.value}" and "${to.value}" don\\'t match`)
      }
    }
  }
  throw new Error(`Invalid unit: "${from.value}"`)
}

export const convertUtils = {
  convert,
}
