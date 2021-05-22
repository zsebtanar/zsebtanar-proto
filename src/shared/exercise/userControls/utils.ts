import { ExerciseSubTaskControlsType, UserControl } from '../types'
import { EvalScript } from '../../script/types'
import { convertPLHashMapToObject } from '../../utils/fn'

const USER_CTRL_WITH_OPTIONS = [
  ExerciseSubTaskControlsType.BinaryChoice,
  ExerciseSubTaskControlsType.SingleChoice,
  ExerciseSubTaskControlsType.MultiChoice,
]

const USER_CTRL_WITH_FIELDS = [ExerciseSubTaskControlsType.NumberList]

export const getSolutionFunctionName = (fieldName: string): string => {
  return `solution-${fieldName}`
}

export const getOptionsFunctionName = (fieldName: string): string => {
  return `options-${fieldName}`
}

export const getFieldsFunctionName = (fieldName: string): string => {
  return `fields-${fieldName}`
}

export function getSolution(ctrl: UserControl, evalScript: EvalScript) {
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

export function resolveDynamicUserControllerPropsForValidation(
  ctrl: UserControl,
  evalScript: EvalScript,
): UserControl {
  if (ctrl.isDynamic) {
    if (USER_CTRL_WITH_OPTIONS.includes(ctrl.type)) {
      const options = evalScript(`(${getOptionsFunctionName(ctrl.name)})`)?.toJS?.() ?? undefined

      if (!options) {
        throw new Error('Invalid user control options')
      }

      ctrl.props = { ...ctrl.props, options: options.map(convertPLHashMapToObject) }
    }
  }
  return ctrl
}

export function resolveDynamicUserControllerProps(
  ctrl: UserControl,
  evalScript: EvalScript,
): UserControl {
  // Apply dynamic options
  ctrl = resolveDynamicUserControllerPropsForValidation(ctrl, evalScript)
  if (ctrl.isDynamic) {
    if (USER_CTRL_WITH_FIELDS.includes(ctrl.type)) {
      const fields = evalScript(`(${getFieldsFunctionName(ctrl.name)})`)?.toJS?.() ?? undefined

      if (!fields) {
        throw new Error('Invalid user control fields')
      }

      ctrl.props = { ...ctrl.props, fields: fields.map(convertPLHashMapToObject) } as any
    }
  }
  return ctrl
}
