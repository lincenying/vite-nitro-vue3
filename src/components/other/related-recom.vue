<template>
    <div class="global-box" w="full" mb-24px p-24px bg="hex-fff" b-rd-6px>
        <div class="global-box-title" m="0 b-24px" pl-16px text="1rem hex-202935" font-bold b-l="6px bolid hex-007bff">相关推荐</div>
        <div class="global-box-content">
            <ul flex="~ wrap justify-between" mb--24px>
                <template v-if="column === 'products'">
                    <li v-for="(item, index) in productsRelatedRecom" :key="index" w="[calc((100%-24px)/2)]" mb-24px>
                        <router-link relative flex="~ items-center" :to="`/home/detail?id=${item.id}`">
                            <i class="i-carbon-dot-mark" mr-5px></i>
                            <h3 text="14px" line-1>{{ item.title }}</h3>
                        </router-link>
                    </li>
                </template>
                <template v-if="column === 'cases'">
                    <li v-for="(item, index) in casesRelatedRecom" :key="index" w="[calc((100%-24px)/2)]" mb-24px>
                        <router-link relative flex="~ items-center" :to="`/cases/detail?id=${item.id}`">
                            <i class="i-carbon-dot-mark" mr-5px></i>
                            <h3 text="14px" line-1>{{ item.title }}</h3>
                        </router-link>
                    </li>
                </template>
                <template v-if="column === 'news'">
                    <li v-for="(item, index) in newsRelatedRecom" :key="index" w="[calc((100%-24px)/2)]" mb-24px>
                        <router-link relative flex="~ items-center" :to="`/news/detail?id=${item.id}`">
                            <i class="i-carbon-dot-mark" mr-5px></i>
                            <h3 text="14px" line-1>{{ item.title }}</h3>
                        </router-link>
                    </li>
                </template>
                <template v-if="column === 'faqs'">
                    <li v-for="(item, index) in faqsRelatedRecom" :key="index" w="[calc((100%-24px)/2)]" mb-24px>
                        <router-link relative flex="~ items-center" :to="`/faqs/detail?id=${item.id}`">
                            <i class="i-carbon-dot-mark" mr-5px></i>
                            <h3 text="14px" line-1>{{ item.title }}</h3>
                        </router-link>
                    </li>
                </template>
                <template v-if="column === 'article'">
                    <li v-for="(item, index) in articleRelatedRecom" :key="index" w="[calc((100%-24px)/2)]" mb-24px>
                        <router-link relative flex="~ items-center" :to="`/article/detail?id=${item.id}`">
                            <i class="i-carbon-dot-mark" mr-5px></i>
                            <h3 text="14px" line-1>{{ item.title }}</h3>
                        </router-link>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'RelatedRecom',
})

const { column } = defineProps<{
    column: string
    categoryId?: number
}>()

const articleStore = useArticleStore()
const { relatedRecom: articleRelatedRecom } = storeToRefs(articleStore)

const casesStore = useCasesStore()
const { relatedRecom: casesRelatedRecom } = storeToRefs(casesStore)

const faqsStore = useFaqsStore()
const { relatedRecom: faqsRelatedRecom } = storeToRefs(faqsStore)

const newsStore = useNewsStore()
const { relatedRecom: newsRelatedRecom } = storeToRefs(newsStore)

const productStore = useProductStore()
const { relatedRecom: productsRelatedRecom } = storeToRefs(productStore)
</script>
