import { map, pipe, slice } from 'ramda'
import { BaseModel, Service } from './fireStoreBase'

export type QuerySnapshot = firebase.firestore.QuerySnapshot

const getRecord = d => ({ id: d.id, ...d.data() })

export class FireStoreGridDS<T extends BaseModel> implements GridDataSource<T> {
  private readonly _service: Service<T>
  private list?: QuerySnapshot
  private options?: GridFilterOptions
  private listeners = new Map<string, Set<() => void>>()

  constructor(service: Service<T>) {
    this._service = service
  }

  public get service(): Service<T> {
    return this._service
  }

  public get size() {
    return this.list?.size ?? 0
  }

  public async getPage(pageNumber: number, limit: number): Promise<T[]> {
    if (!this.list) await this.loadList(this.options)

    const from = pageNumber * limit
    const to = Math.min((pageNumber + 1) * limit - 1, this.size)

    if (to === 0 && from === 0) {
      return []
    }

    if (to <= from) throw new Error('Invalid parameters')

    return pipe(
      slice(from, to),
      map(getRecord)
    )(this.list?.docs ?? [])
  }

  public async refresh() {
    return this.loadList(this.options)
  }

  public async loadList(options?: GridFilterOptions): Promise<QuerySnapshot> {
    this.emitEvent('loadStart')
    this.list = undefined
    this.options = options
    this.list = await this._service.getList(options)
    this.emitEvent('loadEnd')
    if (this.list) {
      return this.list
    } else {
      throw Error('Missing data')
    }
  }

  on(type: DataSourceEvents, callback: () => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)?.add(callback)
  }

  ///

  private emitEvent(type: DataSourceEvents) {
    if (this.listeners.has(type)) {
      for (const listener of Array.from(this.listeners.get(type) ?? [])) {
        listener()
      }
    }
  }
}
