import { findIndex, pathOr, pipe, propEq } from 'ramda'
import { pairsInOrder } from 'shared/util/fn'

type OrderedHints = [[number, DB.Hint]]
const getHints = pipe(pathOr({}, ['hints']), pairsInOrder) as (Subtask: DB.SubTask) => OrderedHints

export default lastHint => snapshot => {
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
