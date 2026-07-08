import type { IListPayload } from './types'
import type { ArticleType } from '~/types/article.types'
import type { ListType } from '~/types/global.types'

export function fetchArticleList(api: ApiType, payload: IListPayload) {
    return api.get<ListType<ArticleType>>('/sqlite3/article/lists', payload)
}

export function fetchArticleDetail(api: ApiType, id: string) {
    return api.get<ArticleType>('/sqlite3/article/detail', { id })
}

export function fetchArticleRecommend(api: ApiType) {
    return api.get<ArticleType[]>('/sqlite3/article/recommend')
}

export function fetchArticleRelatedRecom(api: ApiType) {
    return api.get<ArticleType[]>('/sqlite3/article/related-recom')
}
