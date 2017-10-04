import * as functions from 'firebase-functions'
import algoliasearch from 'algoliasearch'

const fbConfig = functions.config()

const client = algoliasearch(fbConfig.algolia.app_id, fbConfig.algolia.api_key)

// Name fo the algolia index for Blog posts content.
const ALGOLIA_EXERCISES_INDEX = 'exercises'

export function saveExercise(id, content) {
  const index = client.initIndex(ALGOLIA_EXERCISES_INDEX)

  return index.saveObject({
    objectID: id,
    ...content
  })
}

export function removeExerciseIndex(id) {
  const index = client.initIndex(ALGOLIA_EXERCISES_INDEX)

  return index.deleteObjects([id])
}

// Updates the search index when new blog entries are created or updated.
exports.indexentry = functions.database.ref('/blog-posts/{blogid}/text').onWrite(event => {
  const index = client.initIndex(ALGOLIA_EXERCISES_INDEX)
  const firebaseObject = {
    text: event.data.val(),
    objectID: event.params.blogid
  }

  return index
    .saveObject(firebaseObject)
    .then(() =>
      event.data.adminRef.parent.child('last_index_timestamp').set(Date.parse(event.timestamp))
    )
})

// Starts a search query whenever a query is requested (by adding one to the `/search/queries`
// element. Search results are then written under `/search/results`.
exports.searchentry = functions.database.ref('/search/queries/{queryid}').onWrite(event => {
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME)

  const query = event.data.val().query
  const key = event.data.key

  return index.search(query).then(content => {
    const updates = {
      '/search/last_query_timestamp': Date.parse(event.timestamp)
    }
    updates[`/search/results/${key}`] = content
    return admin
      .database()
      .ref()
      .update(updates)
  })
})
