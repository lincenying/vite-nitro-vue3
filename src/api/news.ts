import type { IListPayload } from './types'
import type { ListType } from '~/types/global.types'
import type { NewsType } from '~/types/news.types'

export function fetchNewsList(api: ApiType, payload: IListPayload) {
    return api.get<ListType<NewsType>>('/news/lists', payload)
}

export function fetchNewsDetail(api: ApiType, id: string) {
    return api.get<NewsType>('/news/detail', { id })
}

export function fetchNewsRecommend(api: ApiType) {
    return api.get<NewsType[]>('/news/recommend')
}

export function fetchNewsRelatedRecom(api: ApiType) {
    return api.get<NewsType[]>('/news/related-recom')
}
