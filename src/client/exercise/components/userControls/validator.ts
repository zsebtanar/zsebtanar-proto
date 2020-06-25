import { Interpreter } from './types'
import { UserControl, ExerciseSubTask, ExerciseSubTaskControlsType } from 'shared/exercise/types'
import { singleNumberValidation } from './singleNumber/singleNumberValidation'
import { binaryChoiceValidation } from './binaryChoice/binaryChoiceValidation'
import { singleChoiceValidation } from './singleChoice/singleChoiceValidation'
import { simpleTextValidation } from './simpleText/simpleTextValidation'
import { fractionNumberValidation } from './fractionNumber/fractionNumberValidation'
import { multiChoiceValidation } from './multiChoice/multiChoiceValidator'
import { numberListValidation } from './numberList/numberListValidation'

export function userControlValidator(
  userSolutions: UserControl['solution'],
  subTask: ExerciseSubTask,
  interpreter: Interpreter<any>,
): boolean[] {
  return subTask.controls.map((ctrl, idx) => {
    let solution: any = ctrl.solution
    if (ctrl.isDynamic) {
      solution = interpreter(`(solution-${name})`)
    }
    const userInput = userSolutions[idx]

    switch (ctrl.type) {
      case ExerciseSubTaskControlsType.BinaryChoice:
        return binaryChoiceValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.FractionNumber:
        return fractionNumberValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.MultiChoice:
        return multiChoiceValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.NumberList:
        return numberListValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.SimpleText:
        return simpleTextValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.SingleChoice:
        return singleChoiceValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.SingleNumber:
        return singleNumberValidation(ctrl, solution, userInput)
    }
  })
}
