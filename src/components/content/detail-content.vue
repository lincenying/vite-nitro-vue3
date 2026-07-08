<template>
    <div b-rd-6px mb-24px p-32px bg="hex-fff">
        <h1 font-bold text="center hex-202935 28px">{{ title }}</h1>
        <div flex="~ justify-center items-center" mt-16px text="hex-8a8a8a">
            <i class="i-carbon-user-avatar" w-14px h-14px mr-5px></i>
            <span mr-20px>{{ author }}</span>
            <i class="i-carbon-time" w-14px h-14px mr-5px></i>
            <span mr-20px>{{ date }}</span>
            <i class="i-carbon-collapse-categories" w-14px h-14px mr-5px></i>
            <span mr-20px>{{ category }}</span>
            <span>阅读({{ views }})</span>
        </div>
        <div class="article-content" pt-24px text="hex-202935 16px" lh-28px v-html="content"></div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'ContentDetailContent',
})

defineProps<{
    title: string
    author?: string
    date?: string
    category?: string
    views?: number | string
    content: string
}>()
</script>
