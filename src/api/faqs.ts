import type { IListPayload } from './types'
import type { FaqsType } from '~/types/faqs.types'
import type { ListType } from '~/types/global.types'

export function fetchFaqsList(api: ApiType, payload: IListPayload) {
    return api.get<ListType<FaqsType>>('/faqs/lists', payload)
}

export function fetchFaqsDetail(api: ApiType, id: string) {
    return api.get<FaqsType>('/faqs/detail', { id })
}

export function fetchFaqsRelatedRecom(api: ApiType) {
    return api.get<FaqsType[]>('/faqs/related-recom')
}

export function fetchFaqsRecommend(api: ApiType) {
    return api.get<FaqsType[]>('/faqs/recommend')
}
