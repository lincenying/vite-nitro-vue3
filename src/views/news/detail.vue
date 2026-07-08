<template>
    <div v-loading="loading" class="global-wrap index-wrap">
        <OtherTopBanner title="新闻中心" intro="这是一段描述文字，可以自定义你想要的文字" :img="topBannerImg"></OtherTopBanner>
        <div ref="navigation" class="navigation" flex="~ justify-center items-center" h-42px bg-hex-fff>
            <div max-w-1294px flex-auto text-hex-8a8a8a lt-s1366="mx-24px">当前位置：<router-link to="/">首页</router-link> » <router-link to="/news">新闻中心</router-link> » 新闻详情</div>
        </div>
        <div flex="~ justify-center" mt-24px lt-s1366="mx-24px">
            <div class="page-layout">
                <div class="page-sidebar">
                    <el-affix ref="affix" :offset="104">
                        <HomeRecommend></HomeRecommend>
                        <NewsRecommend></NewsRecommend>
                    </el-affix>
                </div>
                <div class="page-main">
                    <el-skeleton :loading="loading" animated>
                        <template #template>
                            <ContentDetailSkeleton />
                        </template>
                        <template #default>
                            <ContentDetailContent
                                :title="newsDetail.title"
                                :author="newsDetail.author"
                                :date="newsDetail.date"
                                :category="newsDetail.category"
                                :views="newsDetail.views"
                                :content="sanitizedContent"
                            />
                        </template>
                    </el-skeleton>
                    <OtherRelatedRecom column="news"></OtherRelatedRecom>
                    <template v-if="newsDetail.id">
                        <OtherComments :id="newsDetail.id" type="news"></OtherComments>
                        <OtherCommentPost :id="newsDetail.id" type="news"></OtherCommentPost>
                    </template>
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
    name: 'RouterNewsDetail',
    asyncData(ctx) {
        const { store, route, api } = ctx
        const {
            query: { id },
        } = route

        const globalStore = useGlobalStore(store)
        const productStore = useProductStore(store)
        const newsStore = useNewsStore(store)
        const commentStore = useCommentStore(store)

        return Promise.all([
            newsStore.getDetail(id as string, api),
            productStore.getRecommend(api),
            newsStore.getRelatedRecom(api),
            newsStore.getRecommend(api),
            commentStore.getComment({ type: 'news', id: id as string, page: 1 }, api),
            globalStore.setMenuActive('news'),
        ])
    },
})

const id = $(useRouteQuery<string>('id'))

const newsStore = useNewsStore()
const { detail } = storeToRefs(newsStore)

const newsDetail = computed(() => detail.value[id] || {})

const sanitizedContent = computed(() => sanitizeHtml(newsDetail.value.content || ''))

const navigation = ref<HTMLElement>()

const loading = ref(false)

const commentStore = useCommentStore()

async function initFunc() {
    loading.value = true
    await Promise.all([
        newsStore.getDetail(id),
        commentStore.getComment({ type: 'news', id, page: 1 }),
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
    title: `${newsDetail.value.title} - 新闻中心 - ${appName}`,
})

useSaveScroll()
</script>
