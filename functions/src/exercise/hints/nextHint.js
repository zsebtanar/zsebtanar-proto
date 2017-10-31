import { findIndex, pathOr, pipe, propEq } from 'ramda'
import { pairsInOrder } from '../../utils/fn'

const getHints = pipe(pathOr({}, ['hints']), pairsInOrder)

export default (exerciseId, lastHint) => snapshot => {
  const ex = snapshot.val()
  const hints = getHints(ex)
  const lastHintIdx = findIndex(propEq(0, lastHint), hints)

  if (hints.length > lastHintIdx + 1) {
    const [key, hint] = hints[lastHintIdx + 1]
    return { key, hint }
  } else {
    return { hint: false }
  }
}
