import { Alert } from 'client-common/component/general/Alert'
import { Loading } from 'client-common/component/general/Loading'
import * as React from 'react'
import { uid } from 'client-common/util/uuid'
import { GridPagination } from './GridPagination'

type GridColumnRenderer<T> = (data: any, row: T, idx: number) => React.ReactNode

interface GridColumnDefinition<T> {
  key?: string
  title: string
  className?: string
  width?: number
  renderer?: GridColumnRenderer<T>
}

interface InternalGridColumnDefinition<T> extends GridColumnDefinition<T> {
  _id: string
}

interface Props<T> {
  className?: string
  dataSource: GridDataSource<T>
  columnDefs: GridColumnDefinition<T>[]
  defaultGridOptions?: GridFilterOptions
  defaultPageSize?: number
  rowAction?: (event: MouseEvent, rowData: T) => void
}

interface State<T> {
  loading: boolean
  list: T[]
  pageNum: number
  pageSize: number
  error?: any
}

///

function defaultColumnRenderer(data: any) {
  return String(data)
}

///

export class GridComponent<T> extends React.Component<Props<T>, State<T>> {
  private columnDefs: InternalGridColumnDefinition<T>[] = undefined

  state = {
    loading: true,
    list: [],
    pageNum: 0,
    pageSize: this.props.defaultPageSize || 25,
    error: undefined
  }

  componentWillMount(): void {
    this.init()
  }

  private async init() {
    const { dataSource } = this.props
    await dataSource.loadList()
    this.getPage(0)
  }

  public render(): React.ReactNode {
    const { loading, list, error, pageNum } = this.state
    if (loading) {
      return (
        <div>
          <Loading />
        </div>
      )
    } else if (error) {
      return <Alert type={'danger'}>Hiba: {JSON.stringify(error)}</Alert>
    } else if (!list.length) {
      return <Alert type={'info'}>A lista üres</Alert>
    } else {
      return (
        <div>
          <table className="table table-hover table-sm mt-3">
            {this.renderHeader()}
            {this.renderBody()}
          </table>
          <GridPagination
            current={pageNum}
            length={this.getNumOfPages()}
            next={this.nextPage}
            prev={this.prevPage}
            jump={this.getPage}
          />
        </div>
      )
    }
  }

  private renderHeader() {
    const columnDefs = this.getColumnsDefs()
    return (
      <thead className="thead-light">
        <tr>
          {columnDefs.map(def => {
            const style = def.width ? { width: def.width } : undefined
            return (
              <th key={def._id} style={style} className={def.className}>
                {def.title}
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }

  private renderBody() {
    const { list } = this.state
    const { rowAction } = this.props
    const columnDefs = this.getColumnsDefs()

    return (
      <tbody>
        {list.map((row, rIdx) => (
          <tr key={row.id} onClick={rowAction && (e => rowAction(e as any, row))}>
            {columnDefs.map((def, cIdx) => this.renderCell(def, row, rIdx, cIdx))}
          </tr>
        ))}
      </tbody>
    )
  }

  private renderCell(def: InternalGridColumnDefinition<T>, row: T, rowIdx: number, colIdx: number) {
    const data = row[def.key]
    return <td key={def._id}>{def.renderer(data, row, rowIdx)}</td>
  }

  private getColumnsDefs(): InternalGridColumnDefinition<T>[] {
    if (!this.columnDefs) {
      const { columnDefs } = this.props
      this.columnDefs = this.genColumnDefs(columnDefs)
    }
    return this.columnDefs
  }

  private genColumnDefs(customDefs = []): InternalGridColumnDefinition<T>[] {
    let columns
    if (customDefs.length) {
      return customDefs.map(def => ({
        ...{ renderer: defaultColumnRenderer },
        ...def,
        ...{ _id: uid() }
      }))
    } else {
      const { list } = this.state
      if (!list.length) return undefined

      const firstRecord = list[0]
      columns = Object.keys(firstRecord)
      return columns.map(key => ({ _id: uid(), key, title: key, renderer: defaultColumnRenderer }))
    }
  }

  private async getPage(page: number) {
    const { dataSource } = this.props
    const { pageSize } = this.state
    this.setState({ loading: true })
    try {
      const list = await dataSource.getPage(page, pageSize)
      this.setState({ list, pageNum: page, loading: false })
    } catch (error) {
      this.setState({ loading: false, error })
    }
  }

  private nextPage() {
    this.getPage(this.state.pageNum + 1)
  }

  private prevPage() {
    this.getPage(this.state.pageNum - 1)
  }

  private getNumOfPages() {
    return Math.ceil(this.props.dataSource.size / this.state.pageSize)
  }
}
