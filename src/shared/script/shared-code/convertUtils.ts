import { PLNumber, PLString, plNumber } from 'pocket-lisp-stdlib'
import { typeCheck } from './utils'

const conversionTable = {
  angle: {
    deg: 1,
    rad: 180 / Math.PI,
  },
  area: {
    'mm^2': 0.000001,
    'cm^2': 0.0001,
    'in^2': 0.00064516,
    'dm^2': 0.01,
    'ft^2': 0.09290304,
    'm^2': 1,
    'km^2': 1000000,
    'mi^2': 2589988.11,
  },
  length: {
    mm: 0.001,
    cm: 0.01,
    in: 0.0254,
    hüvelyk: 0.0254,
    '"': 0.0254,
    dm: 0.1,
    ft: 0.3048,
    "'": 0.3048,
    m: 1,
    km: 1000,
    mi: 1609.344,
  },
  mass: {
    mg: 0.001,
    g: 1,
    dkg: 10,
    oz: 28.34952,
    lb: 453.59237,
    kg: 1000,
    t: 1000000,
    tonna: 1000000,
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
  volume: {
    'mm^3': 0.000001,
    'cm^3': 0.001,
    ml: 0.001,
    cl: 0.01,
    dl: 0.1,
    l: 1,
    'dm^3': 1,
    hl: 100,
    'm^3': 1000,
    'km^3': 1000000000000,
  },
}

export function convert(num: PLNumber, from: PLString, to: PLString): PLNumber {
  typeCheck(PLNumber, num)
  for (const unitType in conversionTable) {
    const units = conversionTable[unitType]
    if (from.value in units) {
      if (to.value in units) {
        const numConverted = (num.value * units[from.value]) / units[to.value]
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
