import { Service } from './fireStoreBase'
import {
  BaseModel,
  GridFilterOptions,
  GridDataSource,
  DataSourceEvents,
} from 'shared/generic/types'
import type firebaseType from 'firebase'

export type QuerySnapshot = firebaseType.firestore.QuerySnapshot

const getRecord = (d) => ({ id: d.id, ...d.data() })

interface ListMateData {
  count: number
}

export class FireStoreGridDS<T extends BaseModel> implements GridDataSource<T> {
  private readonly options?: GridFilterOptions
  private readonly section?: string
  private list?: QuerySnapshot
  private listeners = new Map<string, Set<() => void>>()
  private metaService?: Service<ListMateData>
  private itemService: Service<T>

  constructor(collection: string, section?: string, options?: GridFilterOptions) {
    this.options = options
    this.section = section
    if (this.section) {
      this.metaService = new Service<ListMateData>(collection, { excludeId: true })
      this.itemService = new Service<T>(`${collection}/${section}/items`)
    } else {
      this.itemService = new Service<T>(`${collection}`)
    }
  }

  public async getNextPage(limit: number): Promise<T[]> {
    return this.getPage({ limit, startAfter: this.list?.docs[0] })
  }

  public async getPrevPage(limit: number): Promise<T[]> {
    return this.getPage({ limit, endBefore: this.list?.docs[0] })
  }

  private async getPage(opts: GridFilterOptions): Promise<T[]> {
    this.emitEvent('loadStart')

    this.list = await this.itemService.getRawList({
      ...this.options,
      ...opts,
    })

    this.emitEvent('loadEnd')

    return this.list.docs.map(getRecord)
  }

  on(type: DataSourceEvents, callback: () => void): void {
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
