import { toArray } from '@lincy/utils'
import { type App, hasInjectionContext } from 'vue'

type AppInstance = App | null

interface ConextType {
    [key: string]: Record<string, any>
}

interface AsyncDataOptions {
    server?: boolean
}

interface AsyncDataType<DataT, ErrorT> {
    data: Ref<DataT | null>
    error: Ref<ErrorT | null>
    loading: Ref<boolean>
    refresh: () => Promise<void>
}

type AsyncData<T, E> = AsyncDataType<T, E> & Promise<AsyncDataType<T, E>>

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

export function resetSSRInstanceProperties(app: App) {
    app.config.globalProperties.initialState = {}
    app.config.globalProperties.globalState = {}
}

export function setClientInstanceProperties(app: App, context: ConextType) {
    app.config.globalProperties.initialState = context.initialState
    app.config.globalProperties.globalState = context.globalState
    piniaInit.state.value = context.piniaState
}

export function deserializeState<T extends Record<string, unknown>>(state: string | T): T {
    console.log('%c[state] >> ', 'color: red', state)
    try {
        if (typeof state === 'string') {
            return JSON.parse(state || '{}') as T
        }
        return state
    }
    catch (error) {
        console.error('Error during state deserialization -', error, state)
        return {} as T
    }
}

export function getContext() {
    const initialState = deserializeState(window.__initialState__)
    const globalState = deserializeState(window.__globalState__)
    const piniaState = deserializeState(window.__piniaState__)

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
 * @param options - 配置选项，默认为{ server: true }。
 *
 * @returns 返回一个AsyncData对象，包含数据、错误信息、加载状态和刷新方法。
 */
export function useAsyncData<DataT, ErrorT = unknown>(
    key: string,
    handler: () => Promise<DataT>,
    options: AsyncDataOptions = { server: false },
): AsyncData<DataT, ErrorT> {
    // 初始化异步数据对象
    const asyncData: AsyncDataType<DataT, ErrorT> = {
        data: ref(null),
        error: ref(null),
        loading: ref(false),
        refresh: async () => {},
    }

    // 获取应用实例和初始状态
    const instance = getAppInstance()!
    const initialState = instance.config.globalProperties.initialState

    // 判断当前环境是否为服务端
    const isServer = import.meta.env.SSR

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
                asyncData.data.value = result
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
    const fetchOnServer = options.server !== false

    // 在服务端且配置允许的情况下执行数据获取
    if (isServer && fetchOnServer) {
        const p = initialFetch()
        if (instance) {
            onServerPrefetch(() => p)
        }
    }

    // 在客户端且配置不允许服务端获取的情况下执行数据获取
    if (!isServer && !fetchOnServer) {
        initialFetch()
    }

    // 将asyncData包装成一个Promise对象并返回
    const asyncDataPromise = Promise.resolve(promise).then(() => asyncData)
    return Object.assign(asyncDataPromise, asyncData) as AsyncData<DataT, ErrorT>
}

export function useState<T>(key: string, init?: () => T | Ref<T>): Ref<T> {
    if (!key || typeof key !== 'string') {
        throw new TypeError(`[useState] key must be a string: ${key}`)
    }

    if (init !== undefined && typeof init !== 'function') {
        throw new Error(`[useState] init property must be a function: ${init}`)
    }

    const instance = getAppInstance()!

    if (!instance) {
        throw new Error('[useState] no instance provided')
    }

    const state = toRef(instance.config.globalProperties.globalState, key)

    if (state.value === undefined && init) {
        const initialValue = init()

        if (isRef(initialValue)) {
            instance.config.globalProperties.globalState[key] = initialValue
            return initialValue as Ref<T>
        }

        state.value = initialValue
    }

    return state
}

export function clearState(keys?: string | string[]): void {
    const instance = getAppInstance()!

    const stateKeys = Object.keys(instance.config.globalProperties.globalState)

    const keysToIterate = !keys ? stateKeys : typeof keys === 'string' ? toArray(keys) : keys

    for (const key of keysToIterate) {
        instance.config.globalProperties.globalState[key] = undefined
    }
}
