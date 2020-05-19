import { PLString } from 'pocket-lisp-stdlib'
import { typeCheck } from './utils'

export const toCapital = (str: string) => {
  return str[0].toUpperCase() + str.substr(1)
}

export const wrapListItems = (list: string[], str: string) => {
  return list.map(item => `${str}${item}${str}`)
}

export const stringUtils = {
  ['to-capital']: (str: PLString) => {
    typeCheck(PLString, str)
    return toCapital(str.value)
  }
}
