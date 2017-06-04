const functions = require('firebase-functions')

const cors = require('cors')({origin: true})
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

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