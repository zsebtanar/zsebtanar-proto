import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { verifyUser } from '../middlewares/firebaseToken'
import { getClassificationLang } from './utils'
import { HandlerError } from '../utils/HandlerError'
import { validate } from '../utils/validator'
import { exerciseSchema } from '../exercise/schemas'

export const route = express.Router()

route.post(
  '/:classificationId',
  [verifyUser, onlyAdmin, validate({ body: exerciseSchema })],
  async (req, res, next) => {
    try {
      const classificationId = req.params.classificationId
      const data = req.body
      const lang = getClassificationLang(classificationId)

      const clsRef = fireStore.collection(`classification`).doc(lang)
      const currentCls = await clsRef.get()

      const newCls = { ...currentCls.data(), [classificationId]: { exerciseCount: 0, ...data } }
      await clsRef.set(newCls)
    } catch (error) {
      next(new HandlerError(500, 'Classification update error', error))
    }
  },
)
