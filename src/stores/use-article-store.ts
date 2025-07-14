import type { ArticleState } from '../types/pinia.types'
import type { ArticleType } from '~/types/article.types'
import { isEmpty } from '@lincy/utils'
import { acceptHMRUpdate } from 'pinia'
import { defaultList } from '~/constants'

interface PayloadType {
    page: number
    pageSize?: number
    tag: string | string[] | undefined
    category: string | string[] | undefined
}

const usePiniaStore = defineStore('articleStore', () => {
    const state: ArticleState = reactive({
        index: defaultList(),
        detail: {},
        relatedRecom: [],
    })

    const getIndex = async (payload: PayloadType, api: ApiType = $api) => {
        const { code, data } = await api.get<ArticleState['index']>('/sqlite3/article/lists', payload)
        if (code === 200 && !isEmpty(data)) {
            state.index = data
        }
    }

    const getDetail = async (id: string, api: ApiType = $api) => {
        const { code, data } = await api.get<ArticleType>('/sqlite3/article/detail', { id })
        if (code === 200 && !isEmpty(data)) {
            state.detail[id] = data
        }

        return data
    }

    const getRelatedRecom = async (api: ApiType = $api) => {
        const { code, data } = await api.get<ArticleType[]>('/sqlite3/article/related-recom', { })
        if (code === 200 && !isEmpty(data)) {
            state.relatedRecom = data
        }

        return data
    }

    return {
        ...toRefs(state),
        getIndex,
        getDetail,
        getRelatedRecom,
    }
})
export default usePiniaStore
export const articleStoreWithout = () => usePiniaStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePiniaStore, import.meta.hot))
}
