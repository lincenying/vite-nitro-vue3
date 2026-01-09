import type { Router, RouteRecordRaw } from 'vue-router'

import type { CusRouteComponent } from '~/types/global.types'
import ls from 'store2'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

const views = import.meta.glob('../views/**/*.vue')

let routes: RouteRecordRaw[] = []
Object.keys(views).forEach((path: string) => {
    const math = path.match(/\.\/views(.*)\.vue$/)
    if (math) {
        const name = math[1].toLowerCase()
        routes.push({
            name: name.replace('/', ''),
            path: name === '/home' ? '/' : name,
            component: views[path], // () => import('./views/**/*.vue')
        })
    }
    return {}
})

routes = routes.concat([{ path: '/:pathMatch(.*)', redirect: '/' }])

const router = createRouter({
    history: isSSR ? createMemoryHistory() : createWebHistory(),
    routes,
})

routerBeforeResolve(router)

export function routerBeforeResolve(router: Router) {
    router.beforeResolve(async (to, from) => {
        const token = ls.get('token')
        if (!token && to.path !== '/login') {
            return { path: '/login' }
        }
        if (token && to.path === '/login') {
            return { path: '/' }
        }

        let diffed = false
        const activated = to.matched.filter((c, i) => {
            return diffed || (diffed = from.matched[i] !== c) || from.path !== to.path
        })

        if (!activated.length && to.fullPath === from.fullPath) {
            return false
        }

        await Promise.all(
            activated.map((c) => {
                const routeComponent = c.components?.default as CusRouteComponent
                if (routeComponent.asyncData) {
                    return routeComponent.asyncData({
                        store: piniaInit,
                        route: to,
                        api: $api,
                    })
                }

                return true
            }),
        )
    })
}

export default router
