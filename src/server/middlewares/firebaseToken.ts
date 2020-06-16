import { admin } from '../utils/firebase'
import { ErrorHandler } from './error'

/**
 Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
 The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
 `Authorization: Bearer <Firebase ID Token>`.
 when decoded successfully, the ID Token content will be added as `req.user`.

 @see: https://github.com/firebase/functions-samples/tree/master/authorized-https-endpoint
 @see: https://firebase.google.com/docs/auth/admin/verify-id-tokens
 */
export async function getToken(req, res, next) {
  const authHeader = req.headers.authorization

  if ((!authHeader || !authHeader.startsWith('Bearer ')) && !req.cookies.__session) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    )
    return next(new ErrorHandler(401, 'Unauthorized'))
  }

  let idToken
  if (authHeader && authHeader.startsWith('Bearer ')) {
    idToken = authHeader.split('Bearer ')[1]
  } else {
    idToken = req.cookies.__session
  }

  try {
    req.user = await admin.auth().verifyIdToken(idToken)
    next()
  } catch (error) {
    next(new ErrorHandler(401, 'Unauthorized', error))
  }
}
