import { floatEq } from 'shared/utils/math'
import { UCNumberList } from 'shared/exercise/types'
import { numberSortAsc } from '../../../utils/fn'

export function numberListValidation(
  control: UCNumberList,
  solution: UCNumberList['solution'],
  userAnswer: string[],
): boolean {
  if ((solution?.length ?? NaN) !== (userAnswer?.length ?? NaN)) {
    return false
  }

  const sortedUserInputs = userAnswer.map(parseFloat).sort(numberSortAsc)
  const sortedSolutions = solution.map(parseFloat).sort(numberSortAsc)

  return sortedSolutions.every((solution, idx) => floatEq(solution, sortedUserInputs[idx]))
}
