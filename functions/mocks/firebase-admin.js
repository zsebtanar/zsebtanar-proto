export default options => {
  const opt = options || {}
  const DB = opt.db || {}
  const dbInstances = []

  const admin = {
    database: () => {
      const db = Database()
      dbInstances.push(db)
      return db
    },
    _getDBInstances: () => dbInstances
  }

  const initializeApp = () => admin

  const Database = function() {
    let path = []
    const getPath = () => path.join('/')
    return {
      ref: p => {
        path = path.concat(p.split('/'))
        return this
      },
      child: p => {
        path = path.concat(p.split('/'))
        return this
      },
      parent: () => {
        path.pop()
        return this
      },
      on: () => Promise.resolve(snapshotWrap(getPath(), DB[getPath()])),
      once: () => this.once(),
      _getPath: getPath
    }
  }

  const snapshotWrap = (ref, data) => ({
    ref,
    val: () => data
  })

  return initializeApp
}
