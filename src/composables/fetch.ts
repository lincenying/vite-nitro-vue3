import type { H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'
import { objToCookies } from '@lincy/utils'
import { appendResponseHeader } from 'h3'
import { ofetch } from 'ofetch'
import { normalizeCookiePath } from '~/utils'

/**
 * ofetch Api 封装
 * ```
    get<T>(url: string, params?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    post<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    put<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    delete<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
 * ```
 */
export const useApi: (cookies?: Record<string, string | number | boolean>, H3Event?: H3Event) => ApiType = (cookies, H3Event) => {
    const isSSR = !!import.meta.env.SSR

    const apiFetch = ofetch.create({
        baseURL: `${import.meta.env.VITE_APP_API}`,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': (cookies && objToCookies(cookies)) || '',
        },
    })

    return {
        post(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'post', data, options)
        },
        get(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'get', data, options)
        },
        put(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'put', data, options)
        },
        delete(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'delete', data, options)
        },
        async RESTful(url, method = 'get', data, options?: FetchOptions) {
            console.log('%c[request-url] >> ', 'color: red', import.meta.env.VITE_APP_API + url, data)
            const response = await apiFetch(url, {
                method,
                query: method === 'get' ? data : undefined,
                body: method === 'get' ? undefined : data,
                timeout: 3000, // Timeout after 3 seconds
                onRequestError({ error }) {
                    if (!isSSR) {
                        ElMessage.closeAll()
                        error && ElMessage.error('Sorry, The Data Request Failed')
                    }
                    console.log('[fetch response error]', error)
                },
                onResponse({ response }) {
                    const setCookies = response.headers.getSetCookie()
                    if (H3Event && setCookies && setCookies.length > 0) {
                        for (const cookie of setCookies) {
                            appendResponseHeader(H3Event, 'set-cookie', normalizeCookiePath(cookie))
                        }
                    }
                    if (response._data.code !== 200) {
                        if (!isSSR)
                            ElMessage.error(response._data.message)
                        return response._data = null
                    }
                    return response._data = response._data || 'success'
                },
                onResponseError({ response }) {
                    // Log error
                    console.log('[fetch response error]', response.status)
                },
                ...options,

            })
            return response
        },
    }
}
if (typeof window !== 'undefined') {
    window.$$api = useApi()
}
export const $api = useApi()
