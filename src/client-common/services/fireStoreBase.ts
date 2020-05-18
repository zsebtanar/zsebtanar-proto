import { curry, pickBy, pipe, reduce, propOr } from 'ramda'
import { app } from '../fireApp'

///

export type DocRef = firebase.firestore.DocumentReference
export type Query = firebase.firestore.Query

export interface BaseModel {
  id?: string
}

interface StoreOptions {
  subCollections?: string[]
}

///

const db = app.firestore()

export class Service<T extends BaseModel> {
  private readonly collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  public async create(data: T, options?: StoreOptions): Promise<DocRef> {
    const doc = await db.collection(this.collectionName).add(omitInvalidFields(options, data))
    await this.storeSubCollection(doc, data, options)

    this.log('CREATE', doc.id, data)
    return doc
  }

  public async update(data: T, options?: StoreOptions): Promise<DocRef> {
    const doc = db.collection(this.collectionName).doc(data.id)

    await Promise.all([
      doc.set(omitInvalidFields(options, data) as any),
      this.storeSubCollection(doc, data, options)
    ])

    this.log('UPDATE', doc.id, data)
    return doc
  }

  public async store(data: T, options?: StoreOptions): Promise<DocRef> {
    return data.id ? this.update(data, options) : this.create(data, options)
  }

  public async storeAll(data: T[]): Promise<DocRef[]> {
    return Promise.all(data.map(d => this.store(d)))
  }

  public async get(id: string, populate?: string[]): Promise<T> {
    const doc = await db
      .collection(this.collectionName)
      .doc(id)
      .get()

    if (!doc.exists) {
      throw new Error('Not found')
    }

    const collections: Partial<T> = await this.populate(doc.id, populate)
    const data = { id: doc.id, ...doc.data(), ...(collections as any) }

    this.log('GET', id, data)
    return data
  }

  public async getList(options?: GridFilterOptions) {
    const collection = db.collection(this.collectionName)
    let res

    if (options) {
      const query = pipe(qReduce(options.where, (q, [prop, op, val]) => q.where(prop, op, val)))(
        collection
      )
      res = await query.get()
    } else {
      res = await collection.get()
    }

    this.log('GET list with filter', options, res)

    return res
  }

  public async delete(id: string): Promise<void> {
    return await db
      .collection(this.collectionName)
      .doc(id)
      .delete()
  }

  public async deleteAll(ids: string[]): Promise<void> {
    const coll = db.collection(this.collectionName)
    await Promise.all(ids.map(id => coll.doc(id).delete()))
  }

  private async populate(id, populate = []): Promise<Partial<T>> {
    const collections = {}
    await Promise.all(
      populate.map(async collection => {
        const res = await new Service(`${this.collectionName}/${id}/${collection}`).getList()
        collections[collection] = res.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
    )
    return collections
  }

  private async storeSubCollection(doc: DocRef, data: T, options?: StoreOptions) {
    const subCollections = propOr([], 'subCollections', options) as string[]
    return await Promise.all(
      subCollections.map(collection =>
        new Service(`${this.collectionName}/${doc.id}/${collection}`).storeAll(data[collection])
      )
    )
  }

  private log(op: string, id: any, data: any) {
    if (__DEV__) {
      const lightText = 'color: gray; font-weight: lighter;'
      const boldText = 'color: black; font-weight: bold;'
      const groupLabel = `%c firestore %c${op.toUpperCase()} %c${
        this.collectionName
      }/${JSON.stringify(id) || ''}`
      console.groupCollapsed(groupLabel, lightText, boldText, lightText)
      console.log(data)
      console.groupEnd()
    }
  }
}

const omitInvalidFields = (options: StoreOptions, data: any) => {
  const subCollections = propOr([], 'subCollections', options) as string[]
  return pickBy(
    (val: any, key: string) => val !== undefined && key !== 'id' && !subCollections.includes(key),
    data
  )
}

const qReduce = curry<any[], (q: Query, val: any) => Query, Query, Query>((list, fn, acc) =>
  reduce(fn, acc, list)
)
