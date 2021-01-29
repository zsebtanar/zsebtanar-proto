import { PLString, plString } from 'pocket-lisp-stdlib'
import { typeCheck } from './utils'

export const toCapital = (str: string): string => {
  return str ? str[0].toUpperCase() + str.substr(1) : ''
}

export const wrapListItems = (list: string[], str: string): string[] => {
  return list.map(item => `${str}${item}${str}`)
}

export const stringUtils = {
  ['to-capital']: (str: PLString): PLString => {
    typeCheck(PLString, str)
    return plString(toCapital(str.value))
  },
}
