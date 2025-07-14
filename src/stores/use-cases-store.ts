import type { CasesState } from '../types/pinia.types'
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

const usePiniaStore = defineStore('casesStore', () => {
    const state: CasesState = reactive({
        index: defaultList(),
        detail: {},
        relatedRecom: [],
    })

    const getIndex = async (payload: PayloadType, api: ApiType = $api) => {
        const { code, data } = await api.get<CasesState['index']>('/cases/lists', payload)
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

    const getRelatedRecom = async (api: ApiType = $api) => {
        const { code, data } = await api.get<CasesState['relatedRecom']>('/cases/related-recom', { })
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
export const casesStoreWithout = () => usePiniaStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePiniaStore, import.meta.hot))
}
