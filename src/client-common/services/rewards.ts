import { app } from '../fireApp'
import { resolveSnapshot } from '../util/firebase'

const DB = app.database()

const Rewards = DB.ref('rewards')

export function getRewards() {
  return Rewards.once('value').then(resolveSnapshot)
}

export async function getRewardsArray() {
  const data = await Rewards.once('value')
  const array = []
  data.forEach(snapshot => {
    const object = { ...snapshot.val() }
    object.id = snapshot.key
    array.push(object)
  })
  return array
}

export function getReward(id) {
  return Rewards.child(id)
    .once('value')
    .then(resolveSnapshot)
}
