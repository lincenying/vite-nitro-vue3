import type { CommentCategoryType } from '~/types/components.types'

export const changeCategory = useEventBus<number>('change-category')
export const setMenuActive = useEventBus<string>('setMenuActive')

export const refreshProductComment = useEventBus<CommentCategoryType>('refresh-product-comment')
export const refreshCaseComment = useEventBus<CommentCategoryType>('refresh-case-comment')
export const refreshNewsComment = useEventBus<CommentCategoryType>('refresh-news-comment')
export const refreshFaqComment = useEventBus<CommentCategoryType>('refresh-faq-comment')
export const refreshArticleComment = useEventBus<CommentCategoryType>('refresh-article-comment')

export const commentEvent = {
    product: refreshProductComment,
    cases: refreshCaseComment,
    news: refreshNewsComment,
    faqs: refreshFaqComment,
    article: refreshArticleComment,
}
