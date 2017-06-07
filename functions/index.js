const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const cors = require('cors')({origin: true})

const Markdown = require('markdown-it')
const katex = require('markdown-it-katex')

exports.checkExercise = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const exerciseId = req.query.key
    const solution = req.query.solution

    admin.database()
      .ref(`/exercise/${exerciseId}`)
      .on('value', snapshot => {
        res.status(200).send({valid: snapshot.val().solution === solution})
      })
  })
})

exports.finalizeExercise = functions.database.ref('/exercise/{exerciseId}')
  .onWrite(event => {
    // Exit when the data is deleted.
    if (!event.data.exists()) {
      return
    }
    const original = event.data.val()
    const update = {}

    // Only edit data when it is first created.
    if (!event.data.previous.exists()) {
      update.draft = true
      update._created = new Date()
    }

    if (event.data.previous.description !== original.description) {
      try {
        update.htmlDescription = new Markdown({})
          .use(katex)
          .render(original.description)
      } catch (e) {
        update.htmlDescription = `<<error - ${e.message}>>`
      }
    }

    if (Object.keys(update).length) {
      return event.data.ref.update(update)
    }
  })
