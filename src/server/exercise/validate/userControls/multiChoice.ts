import { all, isEmpty, isNil, keys } from 'ramda'

export function multiChoiceCheck(
  control: DB.UCMultiChoice,
  solution: DB.UCMultiChoiceSolution,
  userInput: DB.UCMultiChoiceSolution
): boolean {
  if (isNil(solution) || isEmpty(solution)) return false

  return all(key => solution[key] === (userInput?.[key] ?? undefined), keys(solution))
}
