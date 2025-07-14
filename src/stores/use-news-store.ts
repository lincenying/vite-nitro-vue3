import type { NewsState } from '../types/pinia.types'
import type { NewsType } from '~/types/news.types'
import { isEmpty } from '@lincy/utils'
import { acceptHMRUpdate } from 'pinia'
import { defaultList } from '~/constants'

interface PayloadType {
    page: number
    pageSize?: number
    tag: string | string[] | undefined
    category: string | string[] | undefined
}

const usePiniaStore = defineStore('newsStore', () => {
    const state: NewsState = reactive({
        index: defaultList(),
        detail: {},
        recommend: [],
        relatedRecom: [],
    })

    const getIndex = async (payload: PayloadType, api: ApiType = $api) => {
        const { code, data } = await api.get<NewsState['index'] | undefined>('/news/lists', payload)
        if (code === 200 && !isEmpty(data)) {
            state.index = data
        }
    }

    const getDetail = async (id: string, api: ApiType = $api) => {
        const { code, data } = await api.get<NewsType>('/news/detail', { id })
        if (code === 200 && !isEmpty(data)) {
            state.detail[id] = data
        }

        return data
    }

    const getRecommend = async (api: ApiType = $api) => {
        const { code, data } = await api.get<NewsState['recommend']>('/news/recommend', { })
        if (code === 200 && !isEmpty(data)) {
            state.recommend = data
        }
    }

    const getRelatedRecom = async (api: ApiType = $api) => {
        const { code, data } = await api.get<NewsState['relatedRecom']>('/news/related-recom', { })
        if (code === 200 && !isEmpty(data)) {
            state.relatedRecom = data
        }

        return data
    }

    return {
        ...toRefs(state),
        getIndex,
        getDetail,
        getRecommend,
        getRelatedRecom,
    }
})
export default usePiniaStore
export const newsStoreWithout = () => usePiniaStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePiniaStore, import.meta.hot))
}
