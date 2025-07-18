import type { ArticleType } from '~/types/article.types'
import type { CasesType } from '~/types/cases.types'
import type { CommentList } from '~/types/comments.types'
import type { FaqsType } from '~/types/faqs.types'
import type { ListType } from '~/types/global.types'
import type { ProductsType } from '~/types/home.types'
import type { NewsType } from '~/types/news.types'

export interface GlobalState {
    globalLoading: boolean
    routerLoading: boolean
    ISDEV: boolean
    ISPRE: boolean
    ISPROD: boolean
    cookies: Objable
    menuActive: string
}

export interface ProductCategory {
    id: number
    title: string
}

export interface ProductState {
    index: ListType<ProductsType>
    category: ProductCategory[]
    detail: {
        [key: string]: NewsType
    }
    recommend: ProductsType[]
    relatedRecom: ArticleType[]
}

export interface CasesState {
    index: ListType<CasesType>
    detail: {
        [key: string]: NewsType
    }
    relatedRecom: CasesType[]
}

export interface NewsState {
    index: ListType<NewsType>
    detail: {
        [key: string]: NewsType
    }
    recommend: NewsType[]
    relatedRecom: NewsType[]
}

export interface FaqsState {
    index: ListType<FaqsType>
    detail: {
        [key: string]: NewsType
    }
    relatedRecom: FaqsType[]
}

export interface ArticleState {
    index: ListType<ArticleType>
    detail: {
        [key: string]: ArticleType
    }
    relatedRecom: ArticleType[]
}

export interface UserState {
    token: string
    info: Objable
}

export interface CommentState {
    detail: {
        [key: string]: ListType<CommentList>
    }
}
