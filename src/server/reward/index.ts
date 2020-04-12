import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import { onlyAdmin } from '../utils/authorization'

export const route = express.Router()

// Update
route.post('/addReward', [getToken, onlyAdmin], (req, res) => {
  
})
