const { propEq, findIndex, pipe, pathOr } = require('ramda')
const { pairsInOrder } = require('../fn')
const cors = require('cors')({ origin: true })

module.exports = admin => (req, res) => {
  cors(req, res, () => {
    const exerciseId = req.query.key
    const lastHint = req.query.hint

    admin
      .database()
      .ref(`/exercise/private/${exerciseId}`)
      .on('value', snapshot => {
        try {
          const ex = snapshot.val()
          const hints = pipe(pathOr({}, ['hints']), pairsInOrder)(ex)
          const lastHintIdx = lastHint === exerciseId ? -1 : findIndex(propEq(0, lastHint), hints)

          if (hints.length > lastHintIdx + 1) {
            const [key, hint] = hints[lastHintIdx + 1]
            res.status(200).send({ key, hint })
          } else {
            res.status(200).send({ hint: false })
          }
        } catch (e) {
          res.status(500).send(e.message)
        }
      })
  })
}
