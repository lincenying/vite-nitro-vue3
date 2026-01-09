import type { AnyFn } from '@vueuse/core'
import ls from 'store2'

/** 是否服务端渲染阶段 */
export const isSSR = !!import.meta.env.SSR

export const baseURL = isSSR ? import.meta.env.VITE_APP_SSR_API : import.meta.env.VITE_APP_API

export function useGlobal() {
    const ins = getCurrentInstance()!

    const ctx = ins.appContext.config.globalProperties
    const options = ins.type

    return {
        ctx,
        options,
    }
}

/**
 * 竞态锁
 * @param fn 回调函数
 * @param autoUnlock 是否自动解锁
 * @description
 * ```
 * autoUnlock === true 不管 fn 返回什么, 都自动解锁
 * autoUnlock === false 不管 fn 返回什么, 都不自动解锁
 * autoUnlock === 'auto' 当 fn 返回 false 时, 不自动解锁, 返回其他值时, 自动解锁
 * ```
 * @example
 * ```
 * const Fn = useLockFn(async (key) => {
 *  console.log(key)
 * }
 *
 * <div v-on:click="Fn(123)"></div>
 * ```
 */
export function useLockFn(fn: AnyFn, autoUnlock: boolean | 'auto' = 'auto') {
    const lock = ref(false)
    return async (...args: any[]) => {
        if (lock.value) {
            return
        }
        lock.value = true
        try {
            const $return: any = await fn(...args)
            if (autoUnlock === true || (autoUnlock === 'auto' && $return !== false)) {
                lock.value = false
            }
        }
        catch (e) {
            lock.value = false
            throw e
        }
    }
}

/**
 * 保存和恢复滚动位置的钩子函数
 *
 * 该函数在组件挂载时恢复滚动位置，并在路由离开时保存滚动位置。
 */
export function useSaveScroll() {
    if (isSSR)
        return

    const route = useRoute()

    onMounted(() => {
        // 从本地存储中获取当前路由的滚动位置，如果没有则默认为0
        const scrollTop = ls.get(route.fullPath) || 0
        // 将页面滚动到获取到的滚动位置
        window.scrollTo({ top: scrollTop || 0, behavior: 'smooth' })
        // 从本地存储中移除当前路由的滚动位置
        ls.remove(route.fullPath)
    })

    onBeforeRouteLeave((_to, from, next) => {
        console.log('onBeforeRouteLeave', from.fullPath)
        // 将当前页面的滚动位置保存到本地存储中
        const scrollTop = window.scrollY || 0
        if (scrollTop === 0) {
            // 如果滚动位置为0，则不保存
            ls.remove(from.fullPath)
            return next()
        }
        ls.set(from.fullPath, scrollTop)
        // 调用路由导航函数
        next()
    })
}
