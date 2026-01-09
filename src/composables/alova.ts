import { createAlova } from 'alova'
import { useFetcher, useForm, usePagination, useRequest, useSerialRequest, useSerialWatcher, useWatcher } from 'alova/client'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'

const alovaInstance = createAlova({
    /** 基础路径 */
    baseURL,
    /** 请求适配器 */
    // requestAdapter: adapterFetch(),
    /** 状态管理钩子 */
    statesHook: VueHook,
    /** 请求超时时间，单位为毫秒，默认为0，表示永不超时 */
    // timeout: 50000,
    /** 在全局设置共享请求 */
    // shareRequest: false
    /** 全局设置响应缓存 */
    cacheFor: {
        /** 关闭所有GET缓存 */
        // GET: 0,
        /** 设置所有POST缓存1小时 */
        // POST: 60 * 60 * 1000,
    },
    requestAdapter: adapterFetch(),
    /**
     * 全局的请求拦截器
     * 函数参数为一个method实例，包含如url、params、data、headers等请求数据
     * 你可以自由修改这些数据
     */
    beforeRequest(method) {
        // 假设我们需要添加token到请求头
        if (!method.meta?.ignoreToken) {
            method.config.headers.token = 'token'
        }
    },
    /**
     * 全局的响应拦截器
     * 使用 responded 对象分别指定请求成功的拦截器和请求失败的拦截器
     */
    responded: {
        /**
         * 请求成功的拦截器
         * 当使用 `alova/fetch` 请求适配器时，第一个参数接收Response对象
         * 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
         */
        onSuccess: async (response, method) => {
            if (response.status >= 400) {
                throw new Error(response.statusText)
            }
            if (method.meta?.isDownload) {
                return response.blob()
            }
            const json = await response.json()
            if (json.code !== 200) {
                // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
                throw new Error(json.message)
            }

            // 解析的响应数据将传给method实例的transform钩子函数，这些函数将在后续讲解
            return json.data
        },

        /**
         * 请求失败的拦截器
         * 请求错误时将会进入该拦截器。
         * 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
         */
        onError: (err) => {
            console.warn(err.message)
        },

        /**
         * 请求完成的拦截器
         * 当你需要在请求不论是成功、失败、还是命中缓存都需要执行的逻辑时，可以在创建alova实例时指定全局的`onComplete`拦截器，例如关闭请求 loading 状态。
         * 接收当前请求的method实例
         */
        onComplete: async () => {
            // 处理请求完成逻辑
        },
    },
})

const { Get, Post, Put, Delete } = alovaInstance

export default alovaInstance
export { Delete, Get, Post, Put }
export { useFetcher, useForm, usePagination, useRequest, useSerialRequest, useSerialWatcher, useWatcher }

/**
 * 例子
 * ```ts
Post('/api/example', { id: 1 }, { meta: { ignoreToken: true } })
const getFetch = Get<{ data: string }>('/api/example', {
    name: 'exampleFetch',
    params: {
        id: 1,
    },
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    timeout: 10000,
    meta: {
        isDownload: false,
    },
    transform(data) {
        return data
    },
})
const { loading, data, error, downloading, uploading, send, abort, update, onSuccess, onError, onComplete } = useRequest(
    getFetch,
    {
        // 是否立即发送请求
        immediate: true,
        // 强制请求是指绕过缓存的检查触发请求发送的机制
        force: true,
        initialData: undefined,
    },
).onSuccess(({ data, method }) => {
    // 保存响应数据
    localStorage.setItem('placeholder-data', JSON.stringify(data))
    // 也使用alova的level2存储适配器
    // alovaInst.l2cache.set('placeholder-data', data);
    console.log(method)
})
console.log(loading, data, error, downloading, uploading, send, abort, update, onSuccess, onError, onComplete)
 * ```
 */
