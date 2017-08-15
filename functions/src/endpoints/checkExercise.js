const {toPairs} = require('ramda')
const validators = require('../userControls/index')
const cors = require('cors')({origin: true})

module.exports = admin => (req, res) => {
  cors(req, res, () => {
    const exerciseId = req.body.key
    const userSolutions = req.body.solutions

    const validate = (exercise) => {
      return toPairs(exercise.solutions).map(([key, solution]) => {
        const control = exercise.controls[key]
        const userSolution = userSolutions[key]

        switch (control.controlType) {
          case 'simple-text':
            return validators.simpleText(control, solution, userSolution)
          case 'single-number':
            return validators.singleNumber(control, solution, userSolution)
          case 'single-choice':
            return validators.singleChoice(control, solution, userSolution)
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
}
