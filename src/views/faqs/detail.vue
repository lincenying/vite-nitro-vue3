<template>
    <div class="global-wrap index-wrap">
        <OtherTopBanner title="常见问题" intro="这是一段描述文字，可以自定义你想要的文字" :img="topBannerImg"></OtherTopBanner>
        <div ref="navigation" class="navigation" flex="~ justify-center items-center" h-42px bg-hex-fff>
            <div max-w-1294px flex-auto text-hex-8a8a8a lt-s1366="mx-24px">当前位置：<router-link to="/">首页</router-link> » <router-link to="/faqs">常见问题</router-link> » 问题详情</div>
        </div>
        <div flex="~ justify-center" mt-24px lt-s1366="mx-24px">
            <div class="page-layout">
                <div class="page-sidebar">
                    <el-affix ref="affix" :offset="104">
                        <HomeRecommend></HomeRecommend>
                        <FaqsRecommend></FaqsRecommend>
                    </el-affix>
                </div>
                <div class="page-main">
                    <el-skeleton :loading="loading" animated>
                        <template #template>
                            <ContentDetailSkeleton />
                        </template>
                        <template #default>
                            <ContentDetailContent
                                v-if="faqDetail"
                                :title="faqDetail.title"
                                :author="faqDetail.author"
                                :date="faqDetail.date"
                                :category="faqDetail.category"
                                :views="faqDetail.views"
                                :content="sanitizedContent"
                            />
                        </template>
                    </el-skeleton>
                    <OtherRelatedRecom column="faqs"></OtherRelatedRecom>
                    <OtherComments v-if="faqDetail.id" :id="faqDetail.id" type="faqs"></OtherComments>
                    <OtherCommentPost v-if="faqDetail.id" :id="faqDetail.id" type="faqs"></OtherCommentPost>
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
    name: 'RouterFaqsDetail',
    asyncData(ctx) {
        const { store, route, api } = ctx
        const {
            query: { id },
        } = route

        const globalStore = useGlobalStore(store)
        const faqsStore = useFaqsStore(store)
        const productStore = useProductStore(store)
        const newsStore = useNewsStore(store)
        const commentStore = useCommentStore(store)

        return Promise.all([
            faqsStore.getDetail(id as string, api),
            faqsStore.getRelatedRecom(api),
            productStore.getRecommend(api),
            newsStore.getRecommend(api),
            commentStore.getComment({ type: 'faqs', id: id as string, page: 1 }, api),
            globalStore.setMenuActive('faqs'),
        ])
    },
})

const id = $(useRouteQuery<string>('id'))

const faqsStore = useFaqsStore()
const { detail } = storeToRefs(faqsStore)

const faqDetail = computed(() => detail.value[id] || {})

const sanitizedContent = computed(() => sanitizeHtml(faqDetail.value.content || ''))

const navigation = ref<HTMLElement>()

const loading = ref(false)

const commentStore = useCommentStore()

async function initFunc() {
    loading.value = true
    await Promise.all([
        faqsStore.getDetail(id),
        commentStore.getComment({ type: 'faqs', id, page: 1 }),
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
    title: `${faqDetail.value.title} - 常见问题 - ${appName}`,
})

useSaveScroll()
</script>
