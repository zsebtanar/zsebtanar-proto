import { simpleTextCheck } from './simpleText/simpleText'
import { singleNumberValidation } from './singleNumber/singleNumberValidation'
import { fractionNumber } from './fractionNumber/fractionNumber'
import { numberList } from './numberList/numberList'
import { singleChoice } from './singleChoice/singleChoice'
import { binaryChoiceCheck } from './binaryChoice/binaryChoiceValidation'
import { multiChoiceCheck } from './multiChoice/multiChoice'
import { UserControl, ExerciseSubTask } from 'shared/exercise/types'

const types: Record<string, unknown> = {
  'simple-text': simpleTextCheck,
  'single-number': singleNumberValidation,
  'fraction-number': fractionNumber,
  'number-list': numberList,
  'single-choice': singleChoice,
  'binary-choice': binaryChoiceCheck,
  'multi-choice': multiChoiceCheck,
}

export type ValidatorFn = (
  control: UserControl,
  userInput: UserControl['solution'],
  interpreter: (source: string) => unknown,
) => boolean

export function userControlValidator(
  userSolutions: UserControl['solution'],
  subTask: ExerciseSubTask,
  interpreter: (source: string) => unknown,
): boolean[] {
  return subTask.controls.map((ctrl, idx) => {
    const validationFn = types[ctrl.type] as ValidatorFn
    return validationFn(ctrl, userSolutions[idx], interpreter)
  })
}
