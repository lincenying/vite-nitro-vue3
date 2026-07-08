<template>
    <div v-loading="loading" class="global-wrap index-wrap">
        <OtherTopBanner title="案例展示" intro="这是一段描述文字，可以自定义你想要的文字" :img="topBannerImg"></OtherTopBanner>
        <div ref="navigation" class="navigation" flex="~ justify-center items-center" h-42px bg-hex-fff>
            <div max-w-1294px flex-auto text-hex-8a8a8a lt-s1366="mx-24px">当前位置：<router-link to="/">首页</router-link> » <router-link to="/cases">案例展示</router-link> » 案例详情</div>
        </div>
        <div flex="~ justify-center" mt-24px lt-s1366="mx-24px">
            <div class="page-layout">
                <div class="page-sidebar">
                    <el-affix ref="affix" :offset="104">
                        <HomeRecommend></HomeRecommend>
                        <CasesRecommend></CasesRecommend>
                    </el-affix>
                </div>
                <div class="page-main">
                    <el-skeleton :loading="loading" animated>
                        <template #template>
                            <ContentDetailSkeleton />
                        </template>
                        <template #default>
                            <ContentDetailContent
                                v-if="caseDetail"
                                :title="caseDetail.title"
                                :author="caseDetail.author"
                                :date="caseDetail.date"
                                :category="caseDetail.category"
                                :views="caseDetail.views"
                                :content="sanitizedContent"
                            />
                        </template>
                    </el-skeleton>
                    <OtherRelatedRecom column="cases"></OtherRelatedRecom>
                    <OtherComments v-if="caseDetail.id" :id="caseDetail.id" type="cases"></OtherComments>
                    <OtherCommentPost v-if="caseDetail.id" :id="caseDetail.id" type="cases"></OtherCommentPost>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ElAffixType } from '~/types/global.types'
import topBannerImg from '@/assets/images/home/page-banner.jpg'
import { appName } from '~/constants'
import { scrollToElement } from '~/utils'
import { sanitizeHtml } from '~/utils/sanitize'

defineOptions({
    name: 'RouterCasesDetail',
    asyncData(ctx) {
        const { store, route, api } = ctx
        const {
            query: { id },
        } = route

        const globalStore = useGlobalStore(store)
        const casesStore = useCasesStore(store)
        const productStore = useProductStore(store)
        const newsStore = useNewsStore(store)
        const commentStore = useCommentStore(store)

        return Promise.all([
            casesStore.getDetail(id as string, api),
            casesStore.getRelatedRecom(api),
            productStore.getRecommend(api),
            newsStore.getRecommend(api),
            commentStore.getComment({ type: 'cases', id: id as string, page: 1 }, api),
            globalStore.setMenuActive('cases'),
        ])
    },
})

const id = $(useRouteQuery<string>('id'))

const casesStore = useCasesStore()
const { detail } = storeToRefs(casesStore)

const caseDetail = computed(() => detail.value[id] || {})

const sanitizedContent = computed(() => sanitizeHtml(caseDetail.value.content || ''))

const navigation = ref<HTMLElement>()

const loading = ref(false)

const commentStore = useCommentStore()

async function initFunc() {
    loading.value = true
    await Promise.all([
        casesStore.getDetail(id),
        commentStore.getComment({ type: 'cases', id, page: 1 }),
    ])
    loading.value = false
    scrollToElement(navigation, -80)
}

watch(() => id, (newId) => {
    if (newId) {
        initFunc()
    }
})

const affix = ref<ElAffixType>()
onActivated(() => {
    affix.value?.updateRoot()
})

useHead({
    title: `${caseDetail.value.title} - 案例展示 - ${appName}`,
})

useSaveScroll()
</script>
