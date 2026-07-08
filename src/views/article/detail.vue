<template>
    <div v-loading="loading" class="global-wrap index-wrap">
        <OtherTopBanner title="SQLite文章" intro="这是一段描述文字，可以自定义你想要的文字" :img="topBannerImg"></OtherTopBanner>
        <div ref="navigation" class="navigation" flex="~ justify-center items-center" h-42px bg-hex-fff>
            <div max-w-1294px flex-auto text-hex-8a8a8a lt-s1366="mx-24px">当前位置：<NuxtLink to="/">首页</NuxtLink> » <NuxtLink to="/article">SQLite文章</NuxtLink> » 文章详情</div>
        </div>
        <div flex="~ justify-center" mt-24px lt-s1366="mx-24px">
            <div class="page-layout">
                <div class="page-sidebar">
                    <el-affix ref="affix" :offset="104">
                        <HomeRecommend></HomeRecommend>
                        <ArticleRecommend></ArticleRecommend>
                    </el-affix>
                </div>
                <div class="page-main">
                    <el-skeleton :loading="loading" animated>
                        <template #template>
                            <ContentDetailSkeleton />
                        </template>
                        <template #default>
                            <div mb-24px b-rd-6px p-32px bg="hex-fff">
                                <h1 font-bold text="center hex-202935 28px">{{ articleDetail.title }}</h1>
                                <div class="detail-meta" flex="~ justify-center items-center" mt-16px text="hex-8a8a8a">
                                    <i class="i-carbon-user-avatar" mr-5px h-14px w-14px></i>
                                    <span mr-20px>{{ articleDetail.author }}</span>
                                    <i class="i-carbon-time" mr-5px h-14px w-14px></i>
                                    <span mr-20px>{{ articleDetail.date }}</span>
                                    <i class="i-carbon-collapse-categories" mr-5px h-14px w-14px></i>
                                    <span mr-20px>{{ articleDetail.category }}</span>
                                    <span mr-20px>阅读({{ articleDetail.views }})</span>
                                    <span cursor-pointer @click="handleModify">编辑</span>
                                </div>
                                <div class="article-content" pt-24px text="hex-202935 16px" lh-28px v-html="sanitizedContent"></div>
                            </div>
                        </template>
                    </el-skeleton>
                    <OtherRelatedRecom column="article"></OtherRelatedRecom>
                    <template v-if="articleDetail.id">
                        <OtherComments :id="articleDetail.id" type="article"></OtherComments>
                        <OtherCommentPost :id="articleDetail.id" type="article"></OtherCommentPost>
                    </template>
                </div>
            </div>
        </div>
        <article-dialog-post v-if="layer.show" v-model="layer.show" :layer="layer" @get-data="initFunc" />
    </div>
</template>

<script setup lang="ts">
import type { ArticleType } from '~/types/article.types'
import type { GlobalDialogLayer } from '~/types/components.types'
import type { ElAffixType } from '~/types/global.types'
import topBannerImg from '@/assets/images/home/page-banner.jpg'
import { appName } from '~/constants'
import { nl2br, scrollToElement } from '~/utils'
import { sanitizeHtml } from '~/utils/sanitize'

defineOptions({
    name: 'RouterArticleDetail',
    asyncData(ctx) {
        const { store, route, api } = ctx
        const {
            query: { id },
        } = route

        const globalStore = useGlobalStore(store)
        const articleStore = useArticleStore(store)
        const productStore = useProductStore(store)
        const newsStore = useNewsStore(store)
        const commentStore = useCommentStore(store)

        return Promise.all([
            articleStore.getDetail(id as string, api),
            articleStore.getRelatedRecom(api),
            productStore.getRecommend(api),
            newsStore.getRecommend(api),
            commentStore.getComment({ type: 'article', id: id as string, page: 1 }, api),
            globalStore.setMenuActive('article'),
        ])
    },
})

const id = $(useRouteQuery<string>('id'))

const articleStore = useArticleStore()
const { detail } = storeToRefs(articleStore)

const articleDetail = computed(() => detail.value[id] || {})

const sanitizedContent = computed(() => sanitizeHtml(nl2br(articleDetail.value.content || '')))

const navigation = ref<HTMLElement>()

const loading = ref(false)

const commentStore = useCommentStore()

async function initFunc() {
    loading.value = true
    await Promise.all([
        articleStore.getDetail(id),
        commentStore.getComment({ type: 'article', id, page: 1 }),
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
    title: `${articleDetail.value.title} - SQLite文章 - ${appName}`,
})

useSaveScroll()

// 弹窗控制器
const layer: GlobalDialogLayer<Nullable<ArticleType>> = reactive({
    show: false,
    title: '编辑文章',
    showButton: true,
    width: '800px',
    row: null,
})

function handleModify() {
    layer.row = articleDetail.value
    layer.show = true
}
</script>
