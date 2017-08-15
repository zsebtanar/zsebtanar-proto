const {pipe, values, toLower, identity, replace, equals, any} = require('ramda')

module.exports = function simpleTextCheck (control, solution, userInput) {
  const transform = pipe(
    (input) => input || '',
    solution.caseSensitive ? identity : toLower,
    solution.ignoreSpaces ? replace(/\s*/g, '') : identity
  )

  const normalizedInput = transform(userInput)
  const check = pipe(transform, equals(normalizedInput))
  const validate = pipe(values, any(check))

  return validate(solution.options)
}
