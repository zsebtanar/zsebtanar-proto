const admin = {
  database: () => Database()
}

export const initializeApp = () => admin

const Database = function() {
  let path = ''
  return {
    ref: p => {
      path = p
      return this
    },
    child: () => this,
    parent: () => this,
    on: () => Promise.resolve(snapshotWrap(DB[this.path])),
    once: () => Promise.resolve(snapshotWrap(DB[this.path]))
  }
}

const DB = {}

const snapshotWrap = data => {
  return {
    val: () => data
  }
}
