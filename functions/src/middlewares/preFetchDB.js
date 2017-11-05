import { admin } from '../utils/fb-utils'

/**
 * Pre-fetch and store Firebase DB values in request object this format:
 *
 *  { data, ref }
 *
 * @param {string} refPaths Firebase DB ref path
 * @returns {function(*, *, *)} express middleware
 */
export default function preFetch(...refPaths) {
  return (req, res, next) => {
    Promise.all(refPaths.map(resolvePath(req)))
      .then(() => next())
      .catch(error => {
        console.error(error)
        res.status(500).send(`Unexpected error`)
      })
  }
}

const resolvePath = req => refPath => {
  const propName = refPath.split('/')[0]
  return admin
    .database()
    .ref(getIdFromPath(refPath, req.path))
    .once('value')
    .then(snapshot => {
      req.db = req.db || {}
      req.db[propName] = {
        data: snapshot.val(),
        ref: snapshot.ref
      }
    })
}

const getIdFromPath = (refPath, path) => {
  if (/:/.test(refPath)) {
    const value = path.split('/').pop()
    if (/^-/.test(value)) {
      return refPath.replace(/:id/g, value)
    } else {
      throw new Error(`Invalid preFetch ref-path: ${refPath}, request path: ${path}`)
    }
  } else {
    return refPath
  }
}
