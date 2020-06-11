import { BaseModel } from 'shared/generic/types'

export enum AssetGroup {
  Exercise = 'exercise',
  Wiki = 'wiki'
}

export interface Asset {
  url: string
}

// id => url mapping
export type AssetMap = { [id: string]: Asset }

export interface AssetModel extends BaseModel {
  fileName: string
  fullPath: string
  mimeType: string
  url: string
  group: AssetGroup
}
