import type { ArticleType } from '~/types/article.types'
import type { CasesType } from '~/types/cases.types'
import type { CommentList } from '~/types/comments.types'
import type { FaqsType } from '~/types/faqs.types'
import type { ListType } from '~/types/global.types'
import type { ProductsType } from '~/types/home.types'
import type { NewsType } from '~/types/news.types'
import type { UserState } from '~/types/pinia.types'
import { defaultList } from '~/constants'

export const userStorage = useStorage<Nullable<UserState>>('user-info', { token: '', info: {} })

export const productListStore = useStorage<ListType<ProductsType>>('product-list', defaultList())
export const productDetailStore = useStorage<NewsType>('product-detail', {} as NewsType)

export const casesListStore = useStorage<ListType<CasesType>>('cases-list', defaultList())
export const casesDetailStore = useStorage<CasesType>('cases-detail', {} as CasesType)

export const newsListStore = useStorage<ListType<NewsType>>('news-list', defaultList())
export const newsDetailStore = useStorage<NewsType>('news-detail', {} as NewsType)

export const faqsListStore = useStorage<ListType<FaqsType>>('faqs-list', defaultList())
export const faqsDetailStore = useStorage<FaqsType>('faqs-detail', {} as FaqsType)

export const articleListStore = useStorage<ListType<ArticleType>>('article-list', defaultList())
export const articleDetailStore = useStorage<ArticleType>('article-detail', {} as ArticleType)

export const productCommentStore = useStorage<ListType<CommentList>>('product-comment-list', defaultList())
export const caseCommentStore = useStorage<ListType<CommentList>>('case-comment-list', defaultList())
export const newsCommentStore = useStorage<ListType<CommentList>>('news-comment-list', defaultList())
export const faqCommentStore = useStorage<ListType<CommentList>>('faq-comment-list', defaultList())
export const articleCommentStore = useStorage<ListType<CommentList>>('article-comment-list', defaultList())

export const commentStorage = {
    product: productCommentStore,
    case: caseCommentStore,
    news: newsCommentStore,
    faq: faqCommentStore,
    article: articleCommentStore,
}
