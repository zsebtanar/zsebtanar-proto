import { UCSimpleText } from 'shared/exercise/types'

export function simpleTextValidation(
  { props }: UCSimpleText,
  solution: UCSimpleText['solution'],
  userAnswer: string,
): boolean {
  console.log('SIMPLE TEXT', solution, userAnswer)
  userAnswer = userAnswer ?? ''
  if (!props?.caseSensitive) {
    userAnswer = userAnswer.toLowerCase()
  }
  if (props?.ignoreSpaces) {
    userAnswer = userAnswer.replace(/\s*/g, '')
  }

  return solution.some((str) => str === userAnswer)
}
