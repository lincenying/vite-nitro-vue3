<template>
    <div class="global-box" w="full" mb-24px p-24px bg="hex-fff" b-rd-6px>
        <div class="global-box-title" m="0 b-24px" pl-16px text="1rem hex-202935" font-bold b-l="6px bolid hex-007bff">新闻中心</div>
        <div class="global-box-content">
            <ul>
                <li v-for="(item, index) in recommend" :key="index" mb-16px>
                    <router-link :to="`/news/detail?id=${item.id}`" block>
                        <h3 line-2 text-14px lh-20px>{{ item.title }}</h3>
                        <time text="12px hex-8a8a8a">{{ item.date }}</time>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'NewsRecommend',
})

const newsStore = useNewsStore()
const { recommend } = storeToRefs(newsStore)
</script>
