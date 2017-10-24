import { F, propOr, toPairs } from 'ramda'

const types = {
  'simple-text': require('./simpleText').simpleTextCheck,
  'single-number': require('./singleNumber').singleNumber,
  'single-choice': require('./singleChoice').singleChoice,
  'binary-choice': require('./binaryChoice').binaryChoiceCheck,
  'multi-choice': require('./multiChoice').binaryChoiceCheck
}

export default (userSolutions, exercise) => {
  return toPairs(exercise.solutions).map(([key, solution]) => {
    const control = propOr({}, key, exercise.controls)
    const userSolution = propOr(undefined, key, userSolutions)
    const inputTypeValidator = propOr(F, control.controlType, types)

    if (inputTypeValidator === F) {
      console.warn('Invalid control Type: ' + control.controlType)
    }

    return inputTypeValidator(control, solution, userSolution)
  })
}
