import { F, mapObjIndexed, propOr } from 'ramda'

const types = {
  'simple-text': require('./userControls/simpleText').simpleTextCheck,
  'single-number': require('./userControls/singleNumber').singleNumber,
  'fraction-number': require('./userControls/fractionNumber').fractionNumber,
  'number-list': require('./userControls/numberList').numberList,
  'single-choice': require('./userControls/singleChoice').singleChoice,
  'binary-choice': require('./userControls/binaryChoice').binaryChoiceCheck,
  'multi-choice': require('./userControls/multiChoice').binaryChoiceCheck
}

export default (userSolutions, exercise) => {
  return mapObjIndexed((solution, key) => {
    const control = propOr({}, key, exercise.controls)
    const userSolution = propOr(undefined, key, userSolutions)
    const inputTypeValidator = propOr(F, control.controlType, types)

    if (inputTypeValidator === F) {
      console.warn('Invalid control Type: ' + control.controlType)
    }

    return inputTypeValidator(control, solution, userSolution)
  }, exercise.solutions)
}
