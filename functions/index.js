const {propEq, findIndex, pipe, toPairs, pathOr} = require('ramda')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

const {pairsInOrder} = require('./fn')

admin.initializeApp(functions.config().firebase)

const cors = require('cors')({origin: true})

const Markdown = require('markdown-it')
const katex = require('markdown-it-katex')

exports.checkExercise = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const exerciseId = req.body.key
    const userSolutions = req.body.solutions

    const validate = (exercise) => {
      return toPairs(userSolutions).map(([key, us]) => {
        switch (exercise.controls[key].controlType) {
          case 'single-choice':
          case 'single-number':
            return exercise.solutions[key] === us
          default:
            return false
        }
      })
    }

    admin.database()
      .ref(`/exercise/${exerciseId}/private`)
      .on('value', snapshot => {
        try {
          res
            .status(200)
            .send({valid: validate(snapshot.val())})
        } catch (e) {
          res.status(500).send(e.message)
        }
      })
  })
})

exports.getNextHint = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const exerciseId = req.query.key
    const lastHint = req.query.hint

    admin.database()
      .ref(`/exercise/${exerciseId}/private`)
      .on('value', snapshot => {
        try {
          const ex = snapshot.val()
          const hints = pipe(pathOr({}, ['hints']), pairsInOrder)(ex)
          const lastHintIdx = lastHint === exerciseId
            ? -1
            : findIndex(propEq(0, lastHint), hints)

          if (hints.length > (lastHintIdx + 1)) {
            const [key, hint] = hints[lastHintIdx + 1]
            res.status(200).send({key, hint})
          } else {
            res.status(200).send({hint: false})
          }
        } catch (e) {
          res.status(500).send(e.message)
        }
      })
  })
})

const PUBLIC_PROPS = ['_key', '_created', '_updated', 'classification', 'description', 'controls']
const mapPublicData = obj => (acc, key) => {
  if (obj[key]) acc[key] = obj[key]
  return acc
}

exports.finalizeExercise = functions.database.ref('/exercise/{exerciseId}/private')
  .onWrite(event => {
    // Exit when the data is deleted.
    if (!event.data.exists()) return

    const original = event.data.val()

    // Exit when the exercise in draft
    if (original.draft) return

    const publicData = PUBLIC_PROPS.reduce(mapPublicData(original), {})

    try {
      publicData.htmlDescription = new Markdown({})
        .use(katex)
        .render(original.description)
    } catch (e) {
      publicData.htmlDescription = `<<error - ${e.message}>>`
    }

    publicData.hintCount = Object.keys(pathOr({}, ['hints'], original)).length || 0

    return event.data.ref.parent.child('public').set(publicData)
  })
