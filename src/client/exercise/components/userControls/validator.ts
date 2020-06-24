import { Interpreter } from './types'
import { UserControl, ExerciseSubTask, ExerciseSubTaskControlsType } from 'shared/exercise/types'
import { singleNumberValidation } from './singleNumber/singleNumberValidation'
import { binaryChoiceValidation } from './binaryChoice/binaryChoiceValidation'
import { singleChoiceValidation } from './singleChoice/singleChoiceValidation'
import { simpleTextValidation } from './simpleText/simpleTextValidation'

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
        return false
      case ExerciseSubTaskControlsType.MultiChoice:
        return false
      case ExerciseSubTaskControlsType.NumberList:
        return false
      case ExerciseSubTaskControlsType.SimpleText:
        return simpleTextValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.SingleChoice:
        return singleChoiceValidation(ctrl, solution, userInput)
      case ExerciseSubTaskControlsType.SingleNumber:
        return singleNumberValidation(ctrl, solution, userInput)
    }
  })
}
