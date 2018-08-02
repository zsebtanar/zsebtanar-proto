import { all, isEmpty, isNil, keys, propOr } from 'ramda'

export function multiChoiceCheck(
  control: DB.UCMultiChoice,
  solution: DB.UCMultiChoiceSolution,
  userInput: DB.UCMultiChoiceSolution
): boolean {
  if (isNil(solution) || isEmpty(solution)) return false

  return all(key => solution[key] === propOr(undefined, key, userInput), keys(solution))
}
