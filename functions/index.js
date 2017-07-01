const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const cors = require('cors')({origin: true})

const Markdown = require('markdown-it')
const katex = require('markdown-it-katex')

exports.checkExercise = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const exerciseId = req.query.key
    const userSolutions = req.query.solutions

    const validate = (exercise) => {
      return userSolutions.map( (us, idx) => {
        switch (exercise.controls[idx].controlType){
          case 'single-choice':
            return exercise.solutions[idx] === us
          default: return false;
        }
      })
    }

    admin.database()
      .ref(`/exercise/${exerciseId}/private`)
      .on('value', snapshot => {
        res
          .status(200)
          .send({ valid: validate(snapshot.val()) })
      })
  })
})

const PUBLIC_PROPS = ['_key', '_created', '_updated', 'classification', 'inputType']
const mapPublicData = obj => (acc, key) => {
  if (obj[key]) acc[key] = obj[key];
  return acc;
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
      update.htmlDescription = `<<error - ${e.message}>>`
    }

    return event.data.ref.parent.child('public').set(publicData)
  })
