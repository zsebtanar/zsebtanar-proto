import { ExerciseDoc, UCUserAnswer } from 'shared/exercise/types'
import { initInterpreter } from '../../utils/pocketLisp'
import { checkUserControl } from 'shared/exercise/userControls/check'
import {
  getSolution,
  resolveDynamicUserControllerPropsForValidation,
} from 'shared/exercise/userControls/utils'

export function validateUserControl(
  exercise: ExerciseDoc,
  seed: number,
  subtaskIndex: number,
  userAnswers: UCUserAnswer[],
): boolean {
  let evalScript
  if (exercise.script.trim()) {
    evalScript = initInterpreter(exercise.script, seed)
  }

  const subTask = exercise.subTasks[subtaskIndex]

  let result = false
  if (subTask) {
    result = subTask.controls.every((ctrl, idx) => {
      const solution = getSolution(ctrl, evalScript)
      const controller = resolveDynamicUserControllerPropsForValidation(ctrl, evalScript)
      return checkUserControl(controller, solution, userAnswers[idx])
    })
  }
  return result
}
