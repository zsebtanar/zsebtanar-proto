import { map, pipe, slice } from 'ramda'
import { BaseModel, Service } from './fireStoreBase'

export type QuerySnapshot = firebase.firestore.QuerySnapshot

const getRecord = d => ({id: d.id, ...d.data()})

export class FireStoreGridDS<T extends BaseModel> implements GridDataSource<T> {
  private service: Service<T>
  private list: QuerySnapshot
  private options: GridFilterOptions

  constructor(service: Service<T>) {
    this.service = service
  }
  public get size() {
    return this.list ? this.list.size : 0
  }

  public async getPage(pageNumber: number, limit: number): Promise<T[]> {
    if (!this.list) await this.loadList(this.options)

    const from = pageNumber * limit
    const to = Math.min((pageNumber + 1) * limit - 1, this.size)

    if (to <= from) throw new Error('Invalid parameters')

    return await pipe(
      slice(from, to),
      map(getRecord)
    )(this.list.docs)
  }

  public async refresh() {
    if (this.options) {
      return await this.loadList(this.options)
    }
  }

  public async loadList(options?: GridFilterOptions): Promise<QuerySnapshot> {
    this.list = undefined
    this.options = options
    this.list = await this.service.getList(options)
    return this.list
  }
}
