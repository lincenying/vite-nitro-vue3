import { toArray } from '@lincy/utils'
import { type App, hasInjectionContext, type WatchSource } from 'vue'

type AppInstance = App | null

interface ConextType {
    [key: string]: Record<string, any>
}

interface AsyncDataOptions<T = any> {
    /** 是否在服务器端获取数据 */
    server?: boolean
    /** 若设置为 false，将阻止请求立即触发。（默认为 true） */
    immediate?: boolean
    /** 一个工厂函数，用于在异步函数解析之前设置 data 的默认值——在使用 immediate: false 时很有用 */
    default?: () => T
    /** 一个用于在解析后修改 handler 函数结果的函数 */
    transform?: (data: T) => any
    /** 仅从 handler 函数结果中选取此数组中指定的键 */
    pick?: string[]
    /** 监听响应式源以自动刷新 */
    watch?: WatchSource[]
}

interface AsyncDataType<DataT, ErrorT> {
    data: Ref<DataT | null>
    error: Ref<ErrorT | null>
    loading: Ref<boolean>
    refresh: () => Promise<void>
}

type AsyncData<T, E> = AsyncDataType<T, E> & Promise<AsyncDataType<T, E>>

/**
 * 获取当前Vue应用实例
 *
 * 该函数尝试获取当前的Vue应用实例。在有注入上下文的情况下，
 * 它会尝试通过getCurrentInstance获取当前组件实例，并从中提取应用实例。
 * 如果没有当前组件实例或没有注入上下文，则返回null。
 *
 * @returns 返回当前Vue应用实例，如果无法获取则返回null
 */
export function getAppInstance(): AppInstance {
    let instance: AppInstance = null

    if (hasInjectionContext()) {
        const currentInstance = getCurrentInstance()

        if (currentInstance) {
            instance = currentInstance.appContext.app
        }
        else {
            console.log('App instance not found.')
        }
    }

    return instance
}

/**
 * 重置Vue应用实例的SSR相关全局属性
 *
 * @param app - Vue应用实例
 */
export function resetSSRInstanceProperties(app: App) {
    // 添加参数验证，防止运行时错误
    if (!app || !app.config) {
        console.warn('Invalid app instance provided to resetSSRInstanceProperties')
        return
    }

    // 安全地重置 globalProperties 中的状态对象
    app.config.globalProperties.initialState = Object.create(null)
    app.config.globalProperties.globalState = Object.create(null)
}

/**
 * 设置客户端Vue实例的属性
 *
 * 在客户端渲染时，将服务端预取的状态数据设置到Vue应用实例上，
 * 包括初始状态、全局状态以及Pinia状态，确保客户端能够复用服务端数据
 *
 * @param app - Vue应用实例
 * @param context - 包含各种状态数据的上下文对象
 */
export function setClientInstanceProperties(app: App, context: ConextType) {
    app.config.globalProperties.initialState = context.initialState
    app.config.globalProperties.globalState = context.globalState
    piniaInit.state.value = context.piniaState
}

/**
 * 反序列化状态数据
 * 将传入的字符串或对象转换为指定类型的对象
 * @param state - 需要反序列化的状态数据，可以是JSON字符串或对象
 * @returns 反序列化后的对象
 */
export function deserializeState<T extends Record<string, unknown>>(state: string | T): T {
    console.log('%c[state] >> ', 'color: red', state)
    try {
        // 如果是字符串类型，则尝试解析为JSON对象
        if (typeof state === 'string') {
            return destr<T>(state || '{}')
        }
        // 如果已经是对象类型，则直接返回
        return state
    }
    catch (error) {
        console.error('Error during state deserialization -', error, state)
        return {} as T
    }
}

/**
 * 获取应用的上下文状态
 *
 * 从window对象中提取初始状态、全局状态和Pinia状态，并将它们组合成一个上下文对象。
 * 这些状态通常在服务端渲染(SSR)时被注入到页面中，然后在客户端被重新使用。
 *
 * @returns 包含initialState、globalState和piniaState的对象
 */
export function getContext() {
    const initialState = deserializeState(window.__initialState__ || '{}')
    const globalState = deserializeState(window.__globalState__ || '{}')
    const piniaState = deserializeState(window.__piniaState__ || '{}')

    const context: ConextType = {
        initialState,
        globalState,
        piniaState,
    }

    return context
}

/**
 * 异步数据获取函数，用于在客户端和服务端获取异步数据。
 *
 * @param key - 数据的唯一标识符。
 * @param handler - 返回一个Promise的数据获取处理函数。
 * @param options - 配置选项
 *
 * @returns 返回一个AsyncData对象，包含数据、错误信息、加载状态和刷新方法。
 */
export function useAsyncData<DataT, ErrorT = unknown>(
    key: string,
    handler: () => Promise<DataT>,
    options: AsyncDataOptions<DataT> = {},
): AsyncData<DataT, ErrorT> {
    const {
        server = false,
        default: defaultFn,
        transform,
        pick,
        watch = [],
        immediate = true,
    } = options

    // 初始化异步数据对象
    const asyncData: AsyncDataType<DataT, ErrorT> = {
        data: ref<DataT | null>(defaultFn ? defaultFn() : null) as Ref<DataT | null>,
        error: ref(null),
        loading: ref(false),
        refresh: async () => {},
    }

    // 数据转换函数
    const transformData = (rawData: DataT): any => {
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

    // 获取应用实例和初始状态
    const instance = getAppInstance()!
    const initialState = instance.config.globalProperties.initialState

    // 如果初始状态中存在对应key的数据，则赋值给asyncData.data
    if (key in initialState) {
        asyncData.data.value = initialState[key]
    }

    let promise: Promise<void> = Promise.resolve()

    // 定义refresh方法，用于刷新数据
    asyncData.refresh = () => {
        asyncData.loading.value = true

        // 创建一个新的Promise来处理数据获取
        const p = new Promise<DataT>((resolve, reject) => {
            try {
                resolve(handler())
            }
            catch (error) {
                reject(error)
            }
        })
            .then((result) => {
                // 数据获取成功后更新asyncData.data和initialState
                asyncData.data.value = transformData(result)
                asyncData.error.value = null
                instance.config.globalProperties.initialState[key] = asyncData.data.value
            })
            .catch((error) => {
                // 数据获取失败后更新asyncData.error
                asyncData.data.value = null
                asyncData.error.value = error?.message ?? (error as ErrorT)
            })
            .finally(() => {
                // 数据获取完成后更新加载状态
                asyncData.loading.value = false
            })

        promise = p
        return promise
    }

    // 定义初始获取函数
    const initialFetch = () => asyncData.refresh()

    // 根据配置决定是否在服务端获取数据
    const fetchOnServer = server !== false

    // 监听依赖变化
    if (watch.length > 0) {
        watchEffect(() => {
            for (const source of watch) {
                // 触发重新获取
                if (unref(source) !== undefined) {
                    initialFetch()
                    break
                }
            }
        })
    }

    // 立即执行（非懒加载模式）
    if (immediate) {
        // 在服务端且配置允许的情况下执行数据获取
        if (isSSR && fetchOnServer) {
            const p = initialFetch()
            if (instance) {
                onServerPrefetch(() => p)
            }
        }
        // 在客户端且配置不允许服务端获取的情况下执行数据获取
        if (!isSSR && !fetchOnServer) {
            initialFetch()
        }
    }

    // 将asyncData包装成一个Promise对象并返回
    const asyncDataPromise = Promise.resolve(promise).then(() => asyncData)
    return Object.assign(asyncDataPromise, asyncData) as AsyncData<DataT, ErrorT>
}

/**
 * 创建或返回一个全局状态的响应式引用
 *
 * 该函数用于在应用的全局状态中创建或检索一个具有指定键名的响应式引用。
 * 如果该键名的状态不存在且提供了初始化函数，则会使用初始化函数的返回值创建新状态。
 *
 * @param key - 状态的唯一标识符，必须是字符串类型
 * @param init - 可选的初始化函数，用于创建状态的初始值，必须返回一个普通值或Ref引用
 * @returns 返回与指定键名关联的响应式引用
 * @throws 当key不是字符串时抛出TypeError
 * @throws 当init参数存在但不是函数时抛出Error
 * @throws 当无法获取应用实例时抛出Error
 */
export function useState<T>(key: string, init?: () => T | Ref<T>): Ref<T> {
    // 验证key是否为字符串
    if (!key || typeof key !== 'string') {
        throw new TypeError(`[useState] key must be a string: ${key}`)
    }

    // 验证init是否为函数（如果提供）
    if (init !== undefined && typeof init !== 'function') {
        throw new Error(`[useState] init property must be a function: ${init}`)
    }

    // 获取当前应用实例
    const instance = getAppInstance()!

    // 确保能获取到应用实例
    if (!instance) {
        throw new Error('[useState] no instance provided')
    }

    // 从全局状态中创建指定key的响应式引用
    const state = toRef(instance.config.globalProperties.globalState, key)

    // 如果状态尚未初始化且提供了初始化函数，则进行初始化
    if (state.value === undefined && init) {
        const initialValue = init()

        // 如果初始值是一个Ref，则直接将其存储到全局状态并返回
        if (isRef(initialValue)) {
            instance.config.globalProperties.globalState[key] = initialValue
            return initialValue as Ref<T>
        }

        // 否则将初始值赋给state引用
        state.value = initialValue
    }

    return state
}

/**
 * 清除全局状态中的数据
 *
 * @param keys - 要清除的状态键名，可以是单个字符串或字符串数组。
 *   如果不提供该参数，则清除所有状态数据。
 */
export function clearState(keys?: string | string[]): void {
    const instance = getAppInstance()!

    const stateKeys = Object.keys(instance.config.globalProperties.globalState)

    const keysToIterate = !keys ? stateKeys : typeof keys === 'string' ? toArray(keys) : keys

    for (const key of keysToIterate) {
        instance.config.globalProperties.globalState[key] = undefined
    }
}
