import type { ListType } from '~/types/global.types'

export const appName = 'MMF小屋'
export const appDescription = 'MMF小屋'

export function defaultList<T>(): ListType<T> {
    return {
        list: [],
        total: 0,
        totalPage: 0,
        hasPrev: 0,
        hasNext: 0,
        pageSize: 10,
        currPage: 1,

    }
}
