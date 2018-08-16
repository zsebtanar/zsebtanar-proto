import requestValidator from '../middlewares/requestValidator'
import * as Joi from 'joi'
import { errorHandler } from '../utils/error'
import { simpleGet } from '../utils/http'
import * as functions from 'firebase-functions'
import { path, pick } from 'ramda'
import { admin } from '../utils/firebase'
import * as express from 'express'

const SITE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const SECRET_KEY = path(['recaptcha', 'secret_key'], functions.config())
const RECAPTCHA_RESPONSE_PARAM = 'g-recaptcha-response'
const DB = admin.database()
const Feedback = DB.ref('feedback')

const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  type: Joi.string()
    .valid('error', 'note')
    .required(),
  site: Joi.string()
    .max(32)
    .required(),
  pathname: Joi.string()
    .max(128)
    .required(),
  description: Joi.string()
    .max(1024)
    .required(),
  [RECAPTCHA_RESPONSE_PARAM]: Joi.string().required()
})

export const route = express.Router()

route.post(
  '/',
  [requestValidator({ body: schema })],
  errorHandler((req, res) => {
    const body = req.body
    return simpleGet(`${SITE_VERIFY_URL}?secret=${SECRET_KEY}&response=${body[RECAPTCHA_RESPONSE_PARAM]}`)
      .then(validateCaptcha)
      .then(storeFeedback(body))
      .then(() => res.status(204).send())
  })
)

function validateCaptcha(googleResult: string) {
  const result = JSON.parse(googleResult)
  if (!result.success) {
    throw new Error(result['error-codes'])
  }
}

function storeFeedback(data) {
  return () => {
    const _key = Feedback.push().key
    return Feedback.child(_key).update({
      ...pick(['type', 'email', 'description', 'site', 'pathname'], data),
      state: 'new',
      _key,
      _created: new Date()
    })
  }
}