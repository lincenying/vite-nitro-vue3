import type { FaqsState } from '../types/pinia.types'
import type { FaqsType } from '~/types/faqs.types'
import { isEmpty } from '@lincy/utils'
import { acceptHMRUpdate } from 'pinia'
import { defaultList } from '~/constants'

interface PayloadType {
    page: number
    pageSize?: number
    tag: string | string[] | undefined
    category: string | string[] | undefined
}

const usePiniaStore = defineStore('faqsStore', () => {
    const state: FaqsState = reactive({
        index: defaultList(),
        detail: {},
        relatedRecom: [],
    })

    const getIndex = async (payload: PayloadType, api: ApiType = $api) => {
        const { code, data } = await api.get<FaqsState['index']>('/faqs/lists', payload)
        if (code === 200 && !isEmpty(data)) {
            state.index = data
        }
    }

    const getDetail = async (id: string, api: ApiType = $api) => {
        const { code, data } = await api.get<FaqsType>('/news/detail', { id })
        if (code === 200 && !isEmpty(data)) {
            state.detail[id] = data
        }

        return data
    }

    const getRelatedRecom = async (api: ApiType = $api) => {
        const { code, data } = await api.get<FaqsState['relatedRecom']>('/faqs/related-recom', { })
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
export const faqsStoreWithout = () => usePiniaStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePiniaStore, import.meta.hot))
}
