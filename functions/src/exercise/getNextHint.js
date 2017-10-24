import * as express from 'express'
import { findIndex, pathOr, pipe, propEq } from 'ramda'
import { admin } from '../common/fb-utils'
import { pairsInOrder } from '../common/fn'

export default express.Router().get('/', (req, res) => {
  const exerciseId = req.query.key
  const lastHint = req.query.hint

  console.log('getNextHint - start')
  admin
    .database()
    .ref(`/exercise/private/${exerciseId}`)
    .once('value')
    .then(process(exerciseId, lastHint))
    .then(result => res.json(result))
    .catch(e => res.status(500).send(e.message))
})

// ------------------------------------------------------------

const getHints = pipe(pathOr({}, ['hints']), pairsInOrder)

export const process = (exerciseId, lastHint) => snapshot => {
  const ex = snapshot.val()
  const hints = getHints(ex)
  const lastHintIdx = lastHint === exerciseId ? -1 : findIndex(propEq(0, lastHint), hints)
  console.log(exerciseId, lastHint, lastHintIdx, ex)
  if (hints.length > lastHintIdx + 1) {
    const [key, hint] = hints[lastHintIdx + 1]
    return { key, hint }
  } else {
    return { hint: false }
  }
}
