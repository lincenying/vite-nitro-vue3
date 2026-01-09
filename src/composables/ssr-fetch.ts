import type { WatchSource } from 'vue'

// 修改 useAsyncData 函数，添加数据序列化和反序列化逻辑
interface UseAsyncDataOptions<T> {
    key?: string
    handler: () => Promise<T>
    server?: boolean
    lazy?: boolean
    default?: () => T
    transform?: (data: T) => any
    pick?: string[]
    watch?: WatchSource[]
    immediate?: boolean
}

interface UseAsyncDataReturn<T> {
    data: Ref<T | null>
    pending: Ref<boolean>
    refresh: () => Promise<void>
    execute: () => Promise<void>
    error: Ref<Error | null>
    status: Ref<'idle' | 'pending' | 'success' | 'error'>
}

// 服务端缓存 - 每个请求独立
function createSSRContext() {
    const ssrDataCache = new Map<string, any>()
    const pendingPromises = new Map<string, Promise<any>>()

    return {
        ssrDataCache,
        pendingPromises,
        // 序列化缓存数据，用于注入到 HTML
        serialize: () => {
            const data: Record<string, any> = {}
            for (const [key, value] of ssrDataCache.entries()) {
                data[key] = value
            }
            return JSON.stringify(data)
        },
        // 从 HTML 中恢复数据到客户端缓存
        hydrate: (serializedData: string) => {
            try {
                const data = destr<Record<string, any>>(serializedData)
                for (const [key, value] of Object.entries(data)) {
                    ssrDataCache.set(key, value)
                }
            }
            catch (error) {
                console.warn('Failed to hydrate SSR data:', error)
            }
        },
    }
}

// 请求级别的上下文存储
const requestContexts = new WeakMap<object, ReturnType<typeof createSSRContext>>()

export async function _useAsyncData<T>(options: UseAsyncDataOptions<T>): Promise<UseAsyncDataReturn<T>> {
    const {
        key,
        handler,
        server = true,
        lazy = false,
        default: defaultFn,
        transform,
        pick,
        watch = [],
        immediate = true,
    } = options

    const uniqueKey = key || `async-data-${Math.random().toString(36).slice(2)}`
    const isServer = typeof window === 'undefined'

    // 获取或创建请求上下文
    let context: ReturnType<typeof createSSRContext>
    if (isServer) {
        // 服务端：从请求上下文中获取
        const req = (globalThis as any).__req // 假设有全局的请求对象
        if (!requestContexts.has(req)) {
            requestContexts.set(req, createSSRContext())
        }
        context = requestContexts.get(req)!
    }
    else {
        // 客户端：创建或使用现有的上下文
        context = createSSRContext()
        context.hydrate(JSON.stringify(window.__ASYNC_DATA_CTX__ || '{}'))
    }

    const { ssrDataCache, pendingPromises } = context

    const data = ref<T | null>(defaultFn ? defaultFn() : null) as Ref<T | null>
    const pending = ref(false)
    const error = ref<Error | null>(null)
    const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

    // 数据转换函数
    const transformData = (rawData: T): any => {
        let result: any = rawData

        // 应用 pick
        if (pick && Array.isArray(pick) && rawData && typeof rawData === 'object') {
            result = {}
            for (const key of pick) {
                if (key in (rawData as object)) {
                    result[key] = (rawData as any)[key]
                }
            }
        }

        // 应用 transform
        if (transform) {
            result = transform(result)
        }

        return result
    }

    // 执行异步数据获取
    const execute = async (): Promise<void> => {
        // 如果已经在服务端获取过数据，直接使用缓存
        if (isServer && ssrDataCache.has(uniqueKey)) {
            const cachedData = ssrDataCache.get(uniqueKey)
            data.value = cachedData
            status.value = 'success'
            return
        }

        // 防止重复请求
        if (pendingPromises.has(uniqueKey)) {
            const existingPromise = pendingPromises.get(uniqueKey)
            try {
                const result = await existingPromise
                data.value = transformData(result)
                status.value = 'success'
            }
            catch (err) {
                error.value = err as Error
                status.value = 'error'
            }
            return
        }

        // 如果不是服务端环境且配置了不在客户端执行，则直接返回
        if (!isServer && !server) {
            return
        }

        pending.value = true
        status.value = 'pending'
        error.value = null

        try {
            const promise = handler()
            pendingPromises.set(uniqueKey, promise)

            const result = await promise
            const transformedData = transformData(result)

            data.value = transformedData
            status.value = 'success'

            // 服务端缓存数据
            if (isServer) {
                ssrDataCache.set(uniqueKey, transformedData)
            }
        }
        catch (err) {
            error.value = err as Error
            status.value = 'error'
            console.error(`useAsyncData error for key "${uniqueKey}":`, err)
        }
        finally {
            pending.value = false
            pendingPromises.delete(uniqueKey)
        }
    }

    // 刷新函数
    const refresh = async (): Promise<void> => {
        // 清除缓存
        if (isServer) {
            ssrDataCache.delete(uniqueKey)
        }
        pendingPromises.delete(uniqueKey)

        await execute()
    }

    // 监听依赖变化
    if (watch.length > 0) {
        watchEffect(() => {
            for (const source of watch) {
                // 触发重新获取
                if (unref(source) !== undefined) {
                    execute()
                    break
                }
            }
        })
    }

    // 立即执行（非懒加载模式）
    if (immediate && !lazy) {
        if (!isServer && server && ssrDataCache.has(uniqueKey)) {
            const cachedData = ssrDataCache.get(uniqueKey)
            data.value = cachedData
            status.value = 'success'
            // 清理服务端缓存
            ssrDataCache.delete(uniqueKey)
        }
        else {
            await execute()
        }
    }

    return {
        data,
        pending,
        refresh,
        execute,
        error,
        status,
    }
}

// HTML 模板注入函数
export function injectSSRData(html: string, req: any): string {
    if (!requestContexts.has(req)) {
        return html
    }

    const context = requestContexts.get(req)!

    const serializedData = context.serialize()

    // 将数据注入到 HTML 中
    const scriptTag = `<script> window.__ASYNC_DATA_CTX__ = ${serializedData}; </script>`

    return html.replace('</head>', `${scriptTag}</head>`)
}

// 客户端初始化函数
export function initClientAsyncData() {
    if (typeof window !== 'undefined') {
        const context = createSSRContext()
        context.hydrate(JSON.stringify(window.__ASYNC_DATA_CTX__ || '{}'))

        // 清理全局变量
        delete window.__ASYNC_DATA_CTX__
    }
}

// 简化的 useFetch 函数，基于 useAsyncData
export function _useFetch<T>(
    url: string,
    options?: {
        key?: string
        server?: boolean
        lazy?: boolean
        transform?: (data: T) => any
        watch?: WatchSource[]
    },
) {
    return _useAsyncData<T>({
        key: options?.key || url,
        handler: async () => {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json() as Promise<T>
        },
        server: options?.server,
        lazy: options?.lazy,
        transform: options?.transform,
        watch: options?.watch,
    })
}
