import { all, isEmpty, isNil, keys, propOr } from 'ramda'

export function binaryChoiceCheck(
  control: DB.UCBinaryChoice,
  solution: DB.UCBinaryChoiceSolution,
  userInput: DB.UCBinaryChoiceSolution
): boolean {
  if (isNil(solution) || isEmpty(solution)) return false

  return all(
    key => solution[key].toString() === propOr('', key.toString(), userInput).toString(),
    keys(solution)
  )
}
