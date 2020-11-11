import { app } from './fireApp'
import { pickBy } from '../utils/fn'
import { BaseModel } from 'shared/generic/types'
import type firebaseType from 'firebase'

///

export type DocRef = firebaseType.firestore.DocumentReference
export type Query = firebaseType.firestore.Query
export type QuerySnapshot = firebaseType.firestore.QuerySnapshot
export type CollectionReference = firebaseType.firestore.CollectionReference

interface ServiceOptions {
  excludeId: boolean
}

interface StoreOptions {
  subCollections?: string[]
}

///

const db = app.firestore()

export class Service<T extends BaseModel> {
  constructor(
    private readonly collectionName: string,
    private readonly options: ServiceOptions = { excludeId: false },
  ) {}

  public createId(): string {
    return db.collection(this.collectionName).doc().id
  }

  public async create(data: T, options?: StoreOptions): Promise<DocRef> {
    const doc = await db.collection(this.collectionName).add(omitInvalidFields(data, options))
    await this.storeSubCollection(doc, data, options)

    this.log('CREATE', doc.id, data)
    return doc
  }

  public async update(data: T, options?: StoreOptions): Promise<DocRef> {
    const doc = db.collection(this.collectionName).doc(data.id)

    await Promise.all([
      doc.set(omitInvalidFields(data, options)),
      this.storeSubCollection(doc, data, options),
    ])

    this.log('UPDATE', doc.id, data)
    return doc
  }

  public async store(data: T, options?: StoreOptions): Promise<DocRef> {
    return data.id ? this.update(data, options) : this.create(data, options)
  }

  public async storeAll(data: T[]): Promise<DocRef[]> {
    return Promise.all(data.map((d) => this.store(d)))
  }

  public async get(id: string, populate?: string[]): Promise<T> {
    const doc = await db.collection(this.collectionName).doc(id).get()

    if (!doc.exists) {
      throw new Error('Not found')
    }

    const collections: Partial<T> = await this.populate(doc.id, populate || [])
    const data = { ...doc.data(), ...collections } as T
    if (!this.options.excludeId) {
      data.id = doc.id
    }

    this.log('GET', id, data)
    return data
  }

  public async getRawList(options?: GridFilterOptions): Promise<QuerySnapshot> {
    let query: CollectionReference | Query = db.collection(this.collectionName)
    if (options) {
      if (options.where) {
        query = options.where.reduce((q, [prop, op, val]) => q.where(prop, op, val), query)
      }

      if (options.orderBy) {
        query = options.orderBy.reduce((q, [prop, dir]) => q.orderBy(prop, dir), query)
      }

      if (options.startAfter) {
        query = query.startAfter(options.startAfter)
      }

      if (options.endBefore) {
        query = query.endBefore(options.endBefore)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }
    }
    const res = await query.get()

    this.logQueryOptions(options, res)

    return res
  }

  public async getList(options?: GridFilterOptions): Promise<T[]> {
    const res = await this.getRawList(options)
    return res.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }))
  }

  public async delete(id: string): Promise<void> {
    return db.collection(this.collectionName).doc(id).delete()
  }

  public async deleteAll(ids: string[]): Promise<void> {
    const coll = db.collection(this.collectionName)
    await Promise.all(ids.map((id) => coll.doc(id).delete()))
  }

  private async populate(id, populate: string[] = []): Promise<Partial<T>> {
    const collections: Partial<T> = {}
    await Promise.all(
      populate.map(async (collection) => {
        const res = await new Service(`${this.collectionName}/${id}/${collection}`).getList()
        collections[collection] = res
      }),
    )
    return collections
  }

  private async storeSubCollection(doc: DocRef, data: T, options?: StoreOptions) {
    const subCollections = options?.subCollections ?? []
    return Promise.all(
      subCollections.map((collection) =>
        new Service(`${this.collectionName}/${doc.id}/${collection}`).storeAll(data[collection]),
      ),
    )
  }

  private logQueryOptions(options?: GridFilterOptions, data?: unknown) {
    const opt = {
      ...options,
      startAfter: options?.startAfter?.id ?? undefined,
      endBefore: options?.endBefore?.id ?? undefined,
    }

    this.log('GET list with filter', opt, data)
  }

  private log(op: string, id: unknown, data: unknown) {
    if (__DEV__) {
      const lightText = 'color: gray; font-weight: lighter;'
      const boldText = 'color: black; font-weight: bold;'
      const groupLabel = `%c firestore %c${op.toUpperCase()} %c${this.collectionName}/${
        JSON.stringify(id) || ''
      }`
      console.groupCollapsed(groupLabel, lightText, boldText, lightText)
      console.log(data)
      console.groupEnd()
    }
  }
}

function omitInvalidFields<T>(data: T, options?: StoreOptions): T {
  const subCollections = options?.subCollections ?? []
  return pickBy(
    (val: unknown, key: unknown) =>
      val !== undefined && key !== 'id' && !subCollections.includes(key as string),
    data,
  )
}
