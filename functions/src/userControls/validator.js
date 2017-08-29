const {toPairs, propOr, F} = require('ramda')
const types = {
  'simple-text': require('./simpleText'),
  'single-number': require('./singleNumber'),
  'single-choice': require('./singleChoice'),
  'binary-choice': require('./binaryChoice'),
  'multi-choice': require('./multiChoice')
}

module.exports = (userSolutions, exercise) => {
  return toPairs(exercise.solutions).map(([key, solution]) => {
    const control = propOr({}, key, exercise.controls)
    const userSolution = propOr(undefined, key, userSolutions)
    const inputTypeValidator = propOr(F, control.controlType, types)

    if (inputTypeValidator === F){
      console.warn('Invalid control Type: ' + control.controlType)
    }

    return inputTypeValidator(control, solution, userSolution)
  })
}
