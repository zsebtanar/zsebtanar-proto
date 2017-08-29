const validator = require('../userControls/validator')
const cors = require('cors')({origin: true})

module.exports = admin => (req, res) => {
  cors(req, res, () => {
    const exerciseId = req.body.key
    const userSolutions = req.body.solutions

    admin.database()
      .ref(`/exercise/${exerciseId}/private`)
      .on('value', snapshot => {
        try {
          res
            .status(200)
            .send({valid: validator(userSolutions, snapshot.val())})
        } catch (e) {
          res.status(500).send(e.message)
        }
      })
  })
}
