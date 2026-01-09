import type { CommentCategoryType } from '~/types/components.types'
import mitt from 'mitt'

interface EmitterEvents {
    'change-category': number
    'setMenuActive': string

    'refresh-product-comment': any
    'refresh-case-comment': any
    'refresh-news-comment': any
    'refresh-faq-comment': any
    'refresh-article-comment': any
}

// 添加索引签名以满足mitt的类型约束
type EmitterEventsMap = Record<keyof EmitterEvents, any> & Record<string, unknown>

const emitter = mitt<EmitterEventsMap>()

// 创建并暴露mitt
export default emitter

// 监听事件
// emitter.on('change-category', (categoryId) => { })

// 触发事件
// emitter.emit('change-category', 1)

// 清理事件
// emitter.all.clear()

// 移除事件
// emitter.off('change-category')

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

// 监听函数
/**
function listener(event: number) {
    console.log(`news: ${event}`)
}
 */
// 监听事件
// const unsubscribe = changeCategory.on(listener)

// 触发事件
// changeCategory.emit(123)

// 注销监听器
// unsubscribe()
// 或者
// changeCategory.off(listener)

// 清除所有监听器
// changeCategory.reset()
