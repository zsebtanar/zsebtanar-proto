const {pathOr, pick, omit, lensProp, defaultTo, mergeAll, mapObjIndexed, pipe, difference, __, over, union, curry, juxt, evolve} = require('ramda')

const PUBLIC_PROPS = ['_key', '_created', '_updated', 'classification', 'description', 'controls']

const mapPublicData = obj => (acc, key) => {
  if (obj[key]) acc[key] = obj[key]
  return acc
}

module.exports = admin => event => {
  // Exit when the data is deleted.
  if (!event.data.exists()) return

  const original = event.data.val()

  // Exit when the exercise in draft
  if (original.draft) return

  const key = original._key

  const classRef = admin.database().ref(`/classifications`)

  // copy public properties
  const publicData = PUBLIC_PROPS.reduce(mapPublicData(original), {})

  publicData.hintCount = Object.keys(pathOr({}, ['hints'], original)).length || 0
  return Promise.all([
    event.data.ref.parent.child('public').set(publicData),
    classRef
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
  ])
}

const exercise = lensProp('exercise')
const defArray = defaultTo([])

const updateClassification = curry((exKey, selectedItems, object) =>
  pipe(
    juxt([
      pipe(
        pick(selectedItems),
        mapObjIndexed(over(exercise, union([exKey])))
      ),
      pipe(
        omit(selectedItems),
        mapObjIndexed(over(exercise, pipe(defArray, difference(__, [exKey]))))
      )
    ]),
    mergeAll
  )(object)
)
