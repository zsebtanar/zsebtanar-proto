import { pick } from 'ramda'
import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { simpleGet } from '../utils/http'
import * as functions from 'firebase-functions'
import { RECAPTCHA_RESPONSE_PARAM, CreateFeedbackSchema } from './schemas'
import { HandlerError } from '../utils/HandlerError'
import { validate } from '../utils/validator'

const SITE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const SECRET_KEY = functions.config()?.recaptcha?.secret_key
const Feedback = fireStore.collection('feedback')

export const route = express.Router()

route.post('/', [validate({ body: CreateFeedbackSchema })], async (req, res, next) => {
  try {
    const body = req.body

    const googleResult = await simpleGet(
      `${SITE_VERIFY_URL}?secret=${SECRET_KEY}&response=${body[RECAPTCHA_RESPONSE_PARAM]}`,
    )
    validateCaptcha(googleResult)
    await storeFeedback(body)

    res.status(204).send()
  } catch (error) {
    next(new HandlerError(500, 'Create feedback error', error))
  }
})

function validateCaptcha(googleResult: string) {
  const result = JSON.parse(googleResult)
  if (!result.success) {
    throw new Error(result['error-codes'])
  }
}

function storeFeedback(data) {
  return Feedback.add({
    ...pick(['type', 'email', 'description', 'site', 'pathname'], data),
    state: 'new',
    created: new Date(),
  })
}
