<template>
    <div v-loading="loading" class="global-wrap news-wrap">
        <OtherTopBanner title="SQLite文章" intro="这是一段描述文字，可以自定义你想要的文字" :img="topBannerImg"></OtherTopBanner>
        <div ref="navigation" class="navigation" flex="~ justify-center items-center" h-42px bg-hex-fff>
            <div flex="~ justify-between auto" max-w-1294px>
                <div flex-auto text-hex-8a8a8a lt-m1360="mx-24px">当前位置：<router-link to="/">首页</router-link> » SQLite文章</div>
                <div cursor-pointer @click="layer.show = true">发布文章</div>
            </div>
        </div>
        <div flex="~ justify-center" mt-24px lt-m1360="mx-24px">
            <div flex="~ auto justify-between" max-w-1294px>
                <div class="sidebar" w-320px>
                    <el-affix :offset="104">
                        <HomeRecommend></HomeRecommend>
                        <NewsRecommend></NewsRecommend>
                    </el-affix>
                </div>
                <div class="main" flex="auto" w-1px ml-24px>
                    <el-skeleton :loading="loading" animated :count="9">
                        <template #template>
                            <div flex="~ items-center" mb-24px p-24px bg="hex-fff">
                                <el-skeleton-item variant="image" class="!w-80px !h-80px mr-16px" />
                                <div flex="1">
                                    <el-skeleton-item variant="text" class="!w-1/2 !h-26px" />
                                    <el-skeleton-item variant="text" class="!w-80% !h-21px" />
                                    <el-skeleton-item variant="text" class="!w-80% !h-21px" />
                                    <el-skeleton-item variant="text" class="!w-80% !h-21px" />
                                </div>
                            </div>
                        </template>
                        <template #default>
                            <ul>
                                <li
                                    v-for="(item, index) in articleLists.list" :key="index"
                                    relative top-0 flex="~ items-center" mb-24px p-24px b-rd-6px bg="hex-fff" transition="all duration-.3s"
                                >
                                    <div flex="[0_0_80px]" h-80px p="x-0 y-16px" mr-16px b-rd-4px text="hex-8a8a8a 12px center" bg="hex-eee">
                                        <span block font-bold text="hex-007bff 24px" lh-30px>{{ UTC2Date(item.date, 'dd') }}</span>{{ UTC2Date(item.date, 'yyyy-mm') }}
                                    </div>
                                    <div flex-1>
                                        <router-link :to="`/article/detail?id=${item.id}`"><h2 text="18px" lh-26px>{{ item.title }}</h2></router-link>
                                        <p text="14px hex-8a8a8a" lh-21px line-3>{{ item.content }}</p>
                                    </div>
                                </li>
                            </ul>
                            <div v-if="articleLists.total > pageSize" class="page" flex="~ justify-center" mb-24px>
                                <el-pagination background layout="prev, pager, next" :total="articleLists.total" :page-size="pageSize" @current-change="currentChange" />
                            </div>
                        </template>
                    </el-skeleton>
                </div>
            </div>
        </div>
        <article-dialog-post v-if="layer.show" v-model="layer.show" :layer="layer" @get-data="initFn" />
    </div>
</template>

<script setup lang="ts">
import type { ArticleType } from './article.types'
import type { InitType } from './home.types'
import type { GlobalDialogLayer } from '~/components/components.types'
import type { ListType } from '~/types'
import { isEmpty, UTC2Date } from '@lincy/utils'
import topBannerImg from '@/assets/images/home/page-banner.jpg'
import { articleListStore } from '~/composables/storage'

defineOptions({
    name: 'RouterArticle',
})

useHead({
    title: 'MMF小屋-SQLite文章',
})

let page = $ref<number>(1)
const pageSize = $ref<number>(12)

const category = $(useRouteQuery<number>('category'))
const tag = $(useRouteQuery<string>('tag'))

let articleLists = $ref<ListType<ArticleType>>(articleListStore)
async function getData() {
    const { code, data } = await $api.get<ListType<ArticleType>>('/sqlite3/article/lists', { page, pageSize })
    if (code === 200 && !isEmpty(data) && !deepEqual(toRaw(articleListStore.value), data)) {
        articleLists = data
        articleListStore.value = data
    }
}

const navigation = ref<HTMLElement>()
async function initFn(action: InitType = 'init-data') {
    if (action === 'change-data' || action === 'change-page') {
        scrollToNav(navigation, -80)
    }
    if (action === 'change-data') {
        page = 1
    }
    await Promise.all([getData()])
}

const watchData = computed(() => ({ category, tag }))
const { loading } = useFetchData({
    watchData,
    dataHasError: false,
    initFn,
    errorFn: () => {},
    immediate: true,
})

async function currentChange(newPage: number) {
    page = newPage
    initFn('change-page')
}

useSaveScroll()

// 弹窗控制器
const layer: GlobalDialogLayer<Nullable<ArticleType>> = reactive({
    show: false,
    title: '新增文章',
    showButton: true,
    width: '800px',
    row: null,
})
</script>
