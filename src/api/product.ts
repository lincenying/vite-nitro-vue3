import type { IListPayload } from './types'
import type { ProductDetailType } from '~/types/home.types'
import type { ProductCategory, ProductState } from '~/types/pinia.types'

export function fetchProductList(api: ApiType, payload: IListPayload) {
    return api.get<ProductState['index']>('/home/lists', payload)
}

export function fetchProductCategory(api: ApiType) {
    return api.get<ProductCategory[]>('/home/category')
}

export function fetchProductRecommend(api: ApiType) {
    return api.get<ProductState['recommend']>('/home/recommend')
}

export function fetchProductDetail(api: ApiType, id: string) {
    return api.get<ProductDetailType>('/home/detail', { id })
}

export function fetchProductRelatedRecom(api: ApiType) {
    return api.get<ProductState['relatedRecom']>('/home/related-recom')
}
