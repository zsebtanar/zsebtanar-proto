import {
  curry,
  defaultTo,
  difference,
  evolve,
  flip,
  juxt,
  lensProp,
  mapObjIndexed,
  mergeAll,
  omit,
  over,
  pathOr,
  pick,
  pipe,
  union
} from 'ramda'

const exerciseL = lensProp('exercise')
const defArray = defaultTo([])

export const updateAllClassification = (classifications, key, original) => {
  const grades = pathOr([], ['classification', 'grade'], original)
  const subjects = pathOr([], ['classification', 'subject'], original)
  const topics = pathOr([], ['classification', 'topic'], original)
  const tags = pathOr([], ['classification', 'tags'], original)

  return evolve(
    {
      grade: updateClassification(key, grades),
      subject: pipe(
        updateClassification(key, subjects),
        mapObjIndexed(evolve({ topic: updateClassification(key, topics) }))
      ),
      tags: updateClassification(key, tags)
    },
    classifications
  )
}

const updateClassification = curry((exKey, selectedItems, object) =>
  pipe(
    juxt([
      pipe(
        pick(selectedItems),
        mapObjIndexed(over(exerciseL, union([exKey])))
      ),
      pipe(
        omit(selectedItems),
        mapObjIndexed(
          over(
            exerciseL,
            pipe(
              defArray,
              flip(difference)([exKey])
            )
          )
        )
      )
    ]),
    mergeAll
  )(object)
)
