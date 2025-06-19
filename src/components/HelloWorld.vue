<template>
    <div class="greetings">
        <h1 class="green">{{ msg }}</h1>
        <h3>
            您已成功使用 <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> + <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a> 创建了一个项目。下一步是什么？
        </h3>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    msg: string
}>()
</script>

<style scoped>

</style>
