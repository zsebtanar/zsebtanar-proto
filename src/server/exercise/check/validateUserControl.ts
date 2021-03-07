import {
  ExerciseDoc,
  ExerciseSubTaskControlsType,
  UCUserAnswer,
  UserControl,
} from 'shared/exercise/types'
import { EvalScript, initInterpreter } from '../../utils/pocketLisp'
import { checkUserControl } from 'shared/exercise/userControls/check'
import { getOptionsFunctionName, getSolutionFunctionName } from 'shared/exercise/userControls/utils'

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
      const controller = updateUserCtrl(ctrl, evalScript)
      return checkUserControl(controller, solution, userAnswers[idx])
    })
  }
  return result
}

function getSolution(ctrl: UserControl, evalScript: EvalScript) {
  const solution = ctrl.solution
  if (ctrl.isDynamic) {
    const result = evalScript(`(${getSolutionFunctionName(ctrl.name)})`)
    if (typeof result?.['toJS'] === 'function') {
      return result.toJS()
    } else {
      throw new Error('Invalid user control solution')
    }
  }
  return solution
}

const USER_CTRL_WITH_OPTIONS = [
  ExerciseSubTaskControlsType.BinaryChoice,
  ExerciseSubTaskControlsType.SingleChoice,
  ExerciseSubTaskControlsType.MultiChoice,
]

function updateUserCtrl(ctrl: UserControl, evalScript: EvalScript): UserControl {
  // Apply dynamic options
  if (ctrl.isDynamic && USER_CTRL_WITH_OPTIONS.includes(ctrl.type)) {
    const options = evalScript(`(${getOptionsFunctionName(ctrl.name)})`)
    if (typeof options?.['toJS'] === 'function') {
      ctrl.props = { ...ctrl.props, options }
    } else {
      throw new Error('Invalid user control options')
    }
  }
  return ctrl
}
