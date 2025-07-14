import mitt from 'mitt'

interface EmitterEvents {
    'change-category': number
    'refresh-product-comment': any
    'refresh-case-comment': any
    'refresh-news-comment': any
    'refresh-faq-comment': any
    'refresh-article-comment': any
    'setMenuActive': string
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
