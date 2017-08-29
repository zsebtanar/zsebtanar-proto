const {keys, all, propOr, isNil, isEmpty} = require('ramda')

module.exports = function binaryChoiceCheck (control, solution, userInput) {
  if (isNil(solution) || isEmpty(solution) || !isNaN(solution)) return false

  return all(
    key => solution[key].toString() === (propOr('', key, userInput).toString()),
    keys(solution)
  )
}
