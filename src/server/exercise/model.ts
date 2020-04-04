import { evolve, keys, mapObjIndexed, pick, pipe } from 'ramda'
import * as Joi from 'joi'
import { admin } from '../utils/firebase'
import { uidPattern } from '../utils/joi'

const PUBLIC_EXERCISE_PROPS = [
  '_key',
  '_created',
  '_updated',
  'classification',
  'description',
  'subTasks',
  'resources'
]
const PUBLIC_SUB_TASK_PROPS = ['controls', 'order', 'description']
const DB = admin.database()
const PrivateExercise = DB.ref('exercise/private')
const PublicExercise = DB.ref('exercise/public')

export const newPrivateExerciseKey = () => PrivateExercise.push().key

export const getExerciseState = key =>
  PrivateExercise.child(key)
    .child('_state')
    .once('value')

export const getAllPrivateExercise = () => PrivateExercise.once('value')

export const savePrivateExercise = (key, data) => PrivateExercise.child(key).update(data)

export const savePublicExercise = (key, data) =>
  PublicExercise.child(key).set(
    pipe(
      pick(PUBLIC_EXERCISE_PROPS),
      evolve({
        subTasks: mapObjIndexed((task: DB.SubTask) => ({
          ...pick(PUBLIC_SUB_TASK_PROPS, task),
          hintCount: keys(task.hints).length
        })),
        resources: mapObjIndexed(pick(['url']))
      })
    )(data)
  )

export const removePublicExercise = key => PublicExercise.child(key).remove()

export const removeExercise = key =>
  Promise.all([PrivateExercise.child(key).remove(), removePublicExercise(key)])

const classificationSchema = Joi.array().items(Joi.string())

const orderSchema = Joi.number()
  .integer()
  .min(0)
  .required()

const hintSchema = Joi.object({
  order: orderSchema,
  text: Joi.string().required()
})

const controlsSchema = Joi.object({
  order: orderSchema,
  controlType: Joi.string().required(),
  controlProps: Joi.any()
})

const subTaskSchema = Joi.object({
  order: orderSchema,
  title: Joi.string(),
  description: Joi.string().allow(''),
  controls: Joi.object()
    .pattern(uidPattern, controlsSchema)
    .min(1),
  solutions: Joi.object()
    .pattern(uidPattern, Joi.any())
    .pattern(uidPattern, Joi.any())
    .min(1),
  hints: Joi.object()
    .optional()
    .pattern(uidPattern, hintSchema)
})

export const exerciseSchema = Joi.object({
  title: Joi.string().max(128),
  classification: Joi.object().keys({
    grade: classificationSchema,
    subject: classificationSchema,
    topic: classificationSchema,
    tags: classificationSchema
  }),
  difficulty: Joi.any().optional(),
  description: Joi.string().required(),
  subTasks: Joi.object()
    .pattern(uidPattern, subTaskSchema)
    .min(1),
  resources: Joi.object().pattern(
    uidPattern,
    Joi.object({
      _key: Joi.string(),
      name: Joi.string(),
      type: Joi.string().optional(),
      fullPath: Joi.string(),
      url: Joi.string()
    })
  )
})
