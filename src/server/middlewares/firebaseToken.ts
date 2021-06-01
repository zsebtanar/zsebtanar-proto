import type { Request, Response, NextFunction } from 'express'
import { admin } from '../utils/firebase'
import { HandlerError } from '../utils/HandlerError'
import { auth } from 'firebase-admin/lib/auth'
import DecodedIdToken = auth.DecodedIdToken
import { logger } from 'firebase-functions'

/**
 Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
 The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
 `Authorization: Bearer <Firebase ID Token>`.
 when decoded successfully, the ID Token content will be added as `req.user`.

 @see: https://github.com/firebase/functions-samples/tree/master/authorized-https-endpoint
 @see: https://firebase.google.com/docs/auth/admin/verify-id-tokens
 */
export async function verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req['user'] = await getFirebaseUser(req)
    next()
  } catch (error) {
    next(new HandlerError(401, 'Unauthorized', error))
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req['user'] = await getFirebaseUser(req)
  } finally {
    next()
  }
}

async function getFirebaseUser(req: Request): Promise<DecodedIdToken> {
  const authHeader = req.headers.authorization

  if ((!authHeader || !authHeader.startsWith('Bearer ')) && !req.cookies.__session) {
    logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.',
    )
    throw new Error('Unauthorized')
  }

  let idToken
  if (authHeader && authHeader.startsWith('Bearer ')) {
    idToken = authHeader.split('Bearer ')[1]
  } else {
    idToken = req.cookies.__session
  }

  return await admin.auth().verifyIdToken(idToken)
}
