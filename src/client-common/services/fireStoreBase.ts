import { pickBy } from 'ramda'
import { app } from '../fireApp'

///

type DocRef = firebase.firestore.DocumentReference

export interface BaseModel {
  id?: string
}

///

const db = app.firestore()

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
})

export class Service<T extends BaseModel> {
  private readonly collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  public async create(data: T, subCollections: string[] = []): Promise<DocRef> {
    const doc = await db.collection(this.collectionName).add(omitInvalidFields(data))
    await this.storeSubCollection(doc, data, subCollections)

    this.log('CREATE', doc.id, data)
    return doc
  }

  public async update(data: T, subCollections: string[] = []): Promise<DocRef> {
    const doc = db.collection(this.collectionName).doc(data.id)

    await Promise.all([
      doc.set(omitInvalidFields(data) as any),
      this.storeSubCollection(doc, data, subCollections)
    ])

    this.log('UPDATE', doc.id, data)
    return doc
  }

  public async store(data: T, subCollections: string[] = []): Promise<DocRef> {
    return data.id ? this.update(data, subCollections) : this.create(data, subCollections)
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

  public async getAll(): Promise<T[]> {
    const res = await db.collection(this.collectionName).get()

    const list: T[] = []
    res.forEach(doc => list.push({ id: doc.id, ...doc.data() } as T))

    this.log('GET list', '', list)
    return list
  }

  private async populate(id, populate): Promise<Partial<T>> {
    const collections = {}
    await Promise.all(
      populate.map(async collection => {
        const res = await new Service(`${this.collectionName}/${id}/${collection}`).getAll()
        collections[collection] = res || []
      })
    )
    return collections
  }

  private async storeSubCollection(doc: DocRef, data: T, subCollections: string[]) {
    return await Promise.all(
      subCollections.map(collection =>
        new Service(`${this.collectionName}/${doc.id}/${collection}`).storeAll(data[collection])
      )
    )
  }

  private log(op: string, id: string, data: any) {
    if (__DEV__) {
      const groupLabel = `${op.toUpperCase()} - ${this.collectionName}/${id || ''}`
      console.groupCollapsed(groupLabel)
      console.log(data)
      console.groupEnd()
    }
  }
}

const omitInvalidFields = pickBy((val: any, key: string) => val !== undefined && key !== 'id')
