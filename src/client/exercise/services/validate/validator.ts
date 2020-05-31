import { F, mapObjIndexed, propOr } from 'ramda'

const types = {
  'simple-text': require('./userControls/simpleText').simpleTextCheck,
  'single-number': require('./userControls/singleNumber').singleNumber,
  'fraction-number': require('./userControls/fractionNumber').fractionNumber,
  'number-list': require('./userControls/numberList').numberList,
  'single-choice': require('./userControls/singleChoice').singleChoice,
  'binary-choice': require('./userControls/binaryChoice').binaryChoiceCheck,
  'multi-choice': require('./userControls/multiChoice').multiChoiceCheck
}

type ValidatorFn = (
  control: UserControl,
  solution: DB.UserControlSolution,
  userSolution: DB.UserControlSolution
) => boolean

export default (
  userSolutions: ObjectMap<DB.UserControlSolution>,
  subTask: any
): ObjectMap<boolean> => {
  return mapObjIndexed((solution: DB.UserControlSolution, key: string) => {
    const control: DB.UserControl = propOr({}, key, subTask.controls)
    const userSolution: DB.UserControlSolution = propOr(undefined, key, userSolutions)
    const inputTypeValidator = propOr(F, control.controlType, types) as ValidatorFn

    if (inputTypeValidator === F) {
      console.warn('Invalid control Type: ' + control.controlType)
    }

    return inputTypeValidator(control, solution, userSolution)
  }, subTask.solutions)
}
