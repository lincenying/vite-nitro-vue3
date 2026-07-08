import type { IListPayload } from './types'
import type { CasesType } from '~/types/cases.types'
import type { ListType } from '~/types/global.types'
import type { NewsType } from '~/types/news.types'

export function fetchCasesList(api: ApiType, payload: IListPayload) {
    return api.get<ListType<CasesType>>('/cases/lists', payload)
}

export function fetchCasesDetail(api: ApiType, id: string) {
    return api.get<NewsType>('/cases/detail', { id })
}

export function fetchCasesRelatedRecom(api: ApiType) {
    return api.get<CasesType[]>('/cases/related-recom')
}

export function fetchCasesRecommend(api: ApiType) {
    return api.get<CasesType[]>('/cases/recommend')
}
