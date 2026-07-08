<template>
    <div class="global-wrap index-wrap">
        <OtherTopBanner title="产品展示" intro="这是一段描述文字，可以自定义你想要的文字" :img="topBannerImg"></OtherTopBanner>
        <div ref="navigation" class="navigation" flex="~ justify-center items-center" h-42px bg-hex-fff>
            <div max-w-1294px flex-auto text-hex-8a8a8a lt-s1366="mx-24px">当前位置：<router-link to="/">首页</router-link> » <router-link to="/">产品展示</router-link> » 产品详情</div>
        </div>
        <div flex="~ justify-center" mt-24px lt-s1366="mx-24px">
            <div class="page-layout">
                <div class="page-sidebar">
                    <HomeCategory :category-id="productDetail.id"></HomeCategory>
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
                                :title="productDetail.title"
                                :author="productDetail.author"
                                :date="productDetail.date"
                                :category="productDetail.category"
                                :views="productDetail.views"
                                :content="sanitizedContent"
                            />
                        </template>
                    </el-skeleton>
                    <OtherRelatedRecom column="products" :category-id="productDetail.category_id"></OtherRelatedRecom>
                    <OtherComments v-if="productDetail.id" :id="productDetail.id" type="product"></OtherComments>
                    <OtherCommentPost v-if="productDetail.id" :id="productDetail.id" type="product"></OtherCommentPost>
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
    name: 'RouterHomeDetail',
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
            productStore.getDetail(id as string, api),
            productStore.getRecommend(api),
            productStore.getRelatedRecom(api),
            newsStore.getRecommend(api),
            commentStore.getComment({ type: 'product', id: id as string, page: 1 }, api),
            globalStore.setMenuActive('home'),
        ])
    },
})

const id = $(useRouteQuery<string>('id'))

const productStore = useProductStore()
const { detail } = storeToRefs(productStore)

const productDetail = computed(() => detail.value[id] || {})

const sanitizedContent = computed(() => sanitizeHtml(productDetail.value.content || ''))

const navigation = ref<HTMLElement>()

const loading = ref(false)

const commentStore = useCommentStore()

async function initFunc() {
    loading.value = true
    await Promise.all([
        productStore.getDetail(id),
        commentStore.getComment({ type: 'product', id, page: 1 }),
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
    title: `${productDetail.value.title} - 产品展示 - ${appName}`,
})

useSaveScroll()
</script>
