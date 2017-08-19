const {pathOr, pick, omit, lensProp, defaultTo, mergeAll, mapObjIndexed, pipe, difference, __, over, union, curry, juxt, evolve} = require('ramda')

const PUBLIC_PROPS = ['_key', '_created', '_updated', 'classification', 'description', 'controls']

/**
 * onWrite /exercise/{exerciseId}/private
 */
module.exports.onWritePrivateExercise = admin => event => {
  const key = event.params.exerciseId

  // skip remove
  if (!event.data.exists()) {
    return Promise.all([
      removeExercise(event),
      updateAllClassification(admin, key, {})
    ])
  }

  // create / update
  const original = event.data.val()

  return Promise.all([
    updateExercise(event, original),
    updateAllClassification(admin, key, original)
  ])
}

function updateExercise (event, original) {
  // copy public properties
  const publicData = pick(PUBLIC_PROPS, original)

  publicData.hintCount = Object.keys(pathOr({}, ['hints'], original)).length || 0

  return event.data.ref.parent.child('public').set(publicData)
}

function removeExercise (event) {
  return event.data.ref.parent.remove()
}

const updateAllClassification = (admin, key, original) => {
  const classRef = admin.database().ref(`/classifications`)
  return classRef
    .once('value')
    .then(snapshot => {
      const classifications = snapshot.val()
      const grades = pathOr([], ['classification', 'grade'], original)
      const subjects = pathOr([], ['classification', 'subject'], original)
      const topics = pathOr([], ['classification', 'topic'], original)
      const tags = pathOr([], ['classification', 'tags'], original)

      return classRef.update(evolve({
        grade: updateClassification(key, grades),
        subject: pipe(
          updateClassification(key, subjects),
          mapObjIndexed(evolve({topic: updateClassification(key, topics)}))
        ),
        tags: updateClassification(key, tags)
      }, classifications))
    })
}

const exerciseL = lensProp('exercise')
const defArray = defaultTo([])

const updateClassification = curry((exKey, selectedItems, object) =>
  pipe(
    juxt([
      pipe(
        pick(selectedItems),
        mapObjIndexed(over(exerciseL, union([exKey])))
      ),
      pipe(
        omit(selectedItems),
        mapObjIndexed(over(exerciseL, pipe(defArray, difference(__, [exKey]))))
      )
    ]),
    mergeAll
  )(object)
)
