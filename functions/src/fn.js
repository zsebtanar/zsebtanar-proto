const {pipe, sortBy, toPairs, path} = require('ramda')

module.exports.pairsInOrder = pipe(toPairs, sortBy(path([1, 'order'])))
