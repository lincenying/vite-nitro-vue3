<template>
    <div class="global-wrap index-wrap">
        <OtherTopBanner title="产品展示" intro="这是一段描述文字，可以自定义你想要的文字" :img="topBannerImg"></OtherTopBanner>
        <div ref="navigation" class="navigation" flex="~ justify-center items-center" h-42px bg-hex-fff>
            <div max-w-1294px flex-auto text-hex-8a8a8a lt-s1366="mx-24px">当前位置：<router-link to="/">首页</router-link> » 产品展示</div>
        </div>
        <div flex="~ justify-center" mt-24px lt-s1366="mx-24px">
            <div class="page-layout">
                <div class="page-sidebar">
                    <HomeCategory :category-id="category"></HomeCategory>
                    <el-affix ref="affix" :offset="104">
                        <HomeRecommend></HomeRecommend>
                        <NewsRecommend></NewsRecommend>
                    </el-affix>
                </div>
                <div class="page-main">
                    <el-skeleton
                        flex="~ wrap justify-between"
                        :loading="loading"
                        animated
                        :count="9"
                    >
                        <template #template>
                            <div class="home-grid-item" bg="hex-fff" mb-24px>
                                <el-skeleton-item variant="image" class="!w-full !h-200px" />
                                <div p-14px>
                                    <el-skeleton-item variant="text" class="w-1/2 !h-44px" />
                                    <div justify-items-between mt-16px h-29px flex items-center>
                                        <el-skeleton-item variant="text" class="!w-30% !h-29px mr-16px" />
                                        <el-skeleton-item variant="text" class="!w-30% !h-29px mr-16px" />
                                        <el-skeleton-item variant="text" class="!w-30% !h-29px" />
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #default>
                            <ul class="home-ul" flex="~ wrap justify-between">
                                <li
                                    v-for="(item, index) in productLists.list" :key="index"
                                    class="home-grid-item" mb-24px bg="hex-fff"
                                >
                                    <router-link :to="`/home/detail?id=${item.id}`" pt="2/3" relative block overflow-hidden b-rd-6px>
                                        <img
                                            :alt="item.title"
                                            :src="item.imgUrl"
                                            w="full" h="full"
                                            absolute left-0 top-0 object-cover scale="100" transition="all duration-.3s"
                                        >
                                    </router-link>
                                    <div p="24px t-16px">
                                        <router-link to="/">
                                            <h2 text="15px center" line-2 font-700 lh-22px>{{ item.title }}</h2>
                                        </router-link>
                                        <div mt-12px max-h-26px overflow-hidden text-center lh-21px>
                                            <router-link
                                                v-for="(sub_item, sub_index) in item.tag" :key="sub_index"
                                                p="x-8px y-4px" mr-8px inline-block b-rd-4px bg="hex-f3f5f7" un-text="hex-8a8a8a 12px"
                                                :to="`/?tag=${sub_item}`" rel="tag"
                                            >
                                                {{ sub_item }}
                                            </router-link>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div v-if="productLists.total > pageSize" class="page" flex="~ justify-center" mb-24px>
                                <el-pagination background layout="prev, pager, next" :total="productLists.total" :current-page="page" :page-size="pageSize" @current-change="currentChange" />
                            </div>
                        </template>
                    </el-skeleton>
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

defineOptions({
    name: 'RouterHome',
    asyncData(ctx) {
        const { store, route, api } = ctx!
        const {
            params: { category, tag },
        } = route

        const globalStore = useGlobalStore(store)
        const productStore = useProductStore(store)
        const newsStore = useNewsStore(store)

        return Promise.all([
            productStore.getIndex({ page: 1, pageSize: 12, category, tag }, api),
            productStore.getRecommend(api),
            newsStore.getRecommend(api),
            globalStore.setMenuActive('home'),
        ])
    },
})

const { ctx } = useGlobal()

const navigation = ref<HTMLElement>()

let page = $ref<number>(1)
const pageSize = $ref<number>(12)
const category = $(useRouteQuery<string | undefined>('category'))
const tag = $(useRouteQuery<string | undefined>('tag'))

const productStore = useProductStore()
const { index: productLists } = storeToRefs(productStore)

const payload = computed(() => {
    return {
        category,
        tag,
        page,
    }
})

watch(() => [category, tag], () => {
    page = 1
    productStore.getIndex(payload.value)
    scrollToElement(navigation, -80)
})

const loading = ref<boolean>(false)

async function currentChange(newPage: number) {
    loading.value = true
    page = newPage
    await productStore.getIndex(payload.value)
    loading.value = false
    scrollToElement(navigation, -80)
}

const affix = ref<ElAffixType>()
onActivated(() => {
    affix.value?.updateRoot()
})

useHead({
    title: `产品展示 - ${appName}`,
})

useSaveScroll()

let unsubscribe: () => void

onMounted(() => {
    unsubscribe = changeCategory.on(() => {})
    ctx.$notify.success('This is a success message.')
})

onUnmounted(() => {
    unsubscribe()
})
</script>
