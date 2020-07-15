import * as express from 'express'
import { fireStore } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { ErrorHandler } from '../middlewares/error'
import { getToken } from '../middlewares/firebaseToken'

export const route = express.Router()

route.post('/:classificationId', [getToken, onlyAdmin], async (req, res, next) => {
  try {
    const classificationId = req.params.classificationId
    const data = req.body

    await fireStore.collection('classification').doc(classificationId).set(data)
  } catch (error) {
    console.log(error)
    next(new ErrorHandler(500, 'Classification remove error', error))
  }
})
