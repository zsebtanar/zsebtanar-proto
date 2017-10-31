import { admin } from '../utils/fb-utils'

/**
 * Pre-fetch and store Firebase DB values in request object this format:
 *
 *  { data, ref }
 *
 * @param {string} refPath Firebase DB ref path
 * @param {string} [propertyName] request object property name where the data stored
 * @returns {function(*, *, *)} express middleware
 */
export default function preFetch(refPath, propertyName) {
  const propName = propertyName || refPath.split('/')[0]
  return (req, res, next) => {
    return admin
      .database()
      .ref(refPath)
      .once('value')
      .then(snapshot => {
        req[propName] = {
          data: snapshot.val(),
          ref: snapshot.ref
        }
        next()
      })
      .catch(error => {
        res.status(500).send(`Unexpected error: ${error.message}`)
      })
  }
}
