import { UCSimpleText } from 'shared/exercise/types'

export function simpleTextValidation(
  { props }: UCSimpleText,
  solution: UCSimpleText['solution'],
  userInput,
): boolean {
  userInput = userInput ?? ''
  if (!props.caseSensitive) {
    userInput = userInput.toLowerCase()
  }
  if (props.ignoreSpaces) {
    userInput = userInput.replace(/\s*/g, '')
  }

  return solution.some(str => str === userInput)
}
