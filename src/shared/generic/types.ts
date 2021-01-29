import firebase from 'firebase'

import FieldPath = firebase.firestore.FieldPath
import WhereFilterOp = firebase.firestore.WhereFilterOp
import OrderByDirection = firebase.firestore.OrderByDirection
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot

export interface BaseModel {
  id?: string
}
export interface GridFilterOptions {
  where?: [string | FieldPath, WhereFilterOp, any][]
  orderBy?: [string | FieldPath, OrderByDirection][]
  limit?: number
  startAfter?: QueryDocumentSnapshot
  endBefore?: QueryDocumentSnapshot
  startAt?: QueryDocumentSnapshot | string | number
  endAt?: QueryDocumentSnapshot | string | number
}

export type DataSourceEvents = 'loadStart' | 'loadEnd'

export interface GridDataSource<T> {
  getNextPage(limit: number): Promise<T[]>
  getPrevPage(limit: number): Promise<T[]>
  on(type: DataSourceEvents, callback: () => void)
}
export interface ModalProps {
  title?: string
  close: () => void
}

export interface Ordered {
  order: number
}

export interface ObjectMap<T> {
  [key: string]: T
}

export type UIItemStyle =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'

export type ButtonType =
  | UIItemStyle
  | 'link'
  | 'outline-danger'
  | 'outline-dark'
  | 'outline-info'
  | 'outline-light'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'

export type BadgeType = UIItemStyle

export type AlertType = UIItemStyle

export interface NotificationOptions {
  timeout?: number
  description?: string
}
