import { BaseModel, Service } from './fireStoreBase'

export interface MainCategoryModel extends BaseModel {
  title: string
  subCategories?: SubCategoryModel[]
}

export interface SubCategoryModel extends BaseModel {
  title: string
}

export const MainCategoryService = new Service<MainCategoryModel>('category')
export const SubCategoryService = id => new Service<SubCategoryModel>(`category/${id}/subCategory`)
